import * as keytar from "keytar"
import * as crypto from "crypto"
import * as url from "url";
import {Url} from "url";
import {AwfSqlite3} from "../awf_sqlite3";
import * as tough from 'tough-cookie'

const PROFILE = "Default"
const MAC_CHROME_COOKIE_PATH = `${process.env.HOME}/Library/Application Support/Google/Chrome/${PROFILE}/Cookies`
const COOKIE_ENCRYPT_ITERATION = 1003
const CHROME_SALT_TYPE = "saltysalt"
const CHROME_KEY_LENGTH = 16
const CRYPT_DIGEST = "sha1"


const pbkdf2Promise = (chromePassword: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(chromePassword, CHROME_SALT_TYPE, COOKIE_ENCRYPT_ITERATION, CHROME_KEY_LENGTH, CRYPT_DIGEST,
            (err: Error | null, derivedKey: Buffer) => {
                if (err) return reject(err)
                resolve(derivedKey)
            })
    })
}


const buildCookieQuerySql = (host_key: string) =>
    `select creation_utc,
            host_key,
            top_frame_site_key,
            name,
            value,
            encrypted_value,
            path,
            expires_utc,
            is_secure,
            is_httponly,
            last_access_utc,
            has_expires,
            is_persistent,
            priority,
            samesite,
            source_scheme,
            source_port,
            is_same_party
     FROM cookies
     where host_key like '%${host_key}'
     ORDER BY LENGTH(path) DESC, creation_utc ASC`;

const decrypt = (decryptKey: Buffer, encryptedRawData: Buffer): string => {
    const iv = Buffer.from(new Array(CHROME_KEY_LENGTH + 1).join(' '), 'binary');
    const decipher = crypto.createDecipheriv('aes-128-cbc', decryptKey, iv);
    decipher.setAutoPadding(false);

    let encryptedData = encryptedRawData
    encryptedData = encryptedData.slice(3);

    let decoded = decipher.update(encryptedData);
    let final = decipher.final();
    final.copy(decoded, decoded.length - 1);

    let padding = decoded[decoded.length - 1];
    if (padding) {
        decoded = decoded.slice(0, decoded.length - padding);
    }

    return decoded.toString("utf-8");
}

const resolveRawCookie = (rawRecords: RawCookieRecord, decryptKey: Buffer): ChromeCookie => {
    const encryptedValue = rawRecords.encrypted_value;
    if (rawRecords.value === '' && encryptedValue && encryptedValue.length > 0) {
        rawRecords.value = decrypt(decryptKey, encryptedValue);
        delete rawRecords.encrypted_value
    }
    return rawRecords
}

const validUrl = (urlStr: string): Url => {
    const newUrl = url.parse(urlStr, false, false);
    if (!newUrl.protocol || !newUrl.hostname) {
        throw new Error('Could not parse URI, format should be http://www.example.com/path/')
    }
    return newUrl
}

const filterValidCookies = (cookies: ChromeCookie[], url: Url): ChromeCookie[] => {
    let validCookies = []
    for (let cookie of cookies) {

        if (cookie.is_secure && !url.protocol?.match("https")) {
            continue
        }

        if (!tough.domainMatch(url.host!!, cookie.host_key!!, true)) {
            continue
        }

        if (!tough.pathMatch(url.path!!, cookie.path!!)) {
            continue
        }

        validCookies.push(cookie)
    }

    return validCookies;
}

const convertRawToSetCookieStrings = (cookies: ChromeCookie[]) => {
    let strings: string = "";
    cookies.forEach(function (cookie, index) {
        strings = `${cookie.name}=${cookie.value}; ${strings}`;
    });
    return strings;
}

const tld = require('tldjs')

export class ChromeCookieManager {

    public static getCookie(accessUrl: string): Promise<ChromeCookie[]> {
        const newUrl = validUrl(accessUrl)
        const awfSqlite3 = AwfSqlite3.initAwfDB(MAC_CHROME_COOKIE_PATH);
        const cookieSql = buildCookieQuerySql(tld.getDomain(newUrl.host));

        const allQueriedCookies = awfSqlite3.query(cookieSql);
        const cryptKeyPromise = keytar.getPassword('Chrome Safe Storage', 'Chrome')
            .then(password => pbkdf2Promise(password!!));

        let cryptKey: Buffer;

        return Promise.all([allQueriedCookies, cryptKeyPromise])
            .then(([records, key]) => {
                cryptKey = key
                return records
            })
            .then((records) => {
                awfSqlite3.close()
                const validCookies = records.map(it => resolveRawCookie(it, cryptKey));
                return filterValidCookies(validCookies, newUrl)
            })
    }


    public static formatCookie(cookies: ChromeCookie[]) {
        return convertRawToSetCookieStrings(cookies)
    }

}

class ChromeCookie {
    creation_utc?: number
    host_key?: string
    top_frame_site_key?: string
    name?: string
    value?: string
    path?: string
    expires_utc?: number
    is_secure?: boolean
    is_httponly?: boolean
    last_access_utc?: string
    has_expires?: boolean
    is_persistent?: boolean
    priority?: number
    samesite?: boolean
    source_scheme?: string
    source_port?: number
    is_same_part?: boolean
}

class RawCookieRecord extends ChromeCookie {
    encrypted_value?: Buffer
}
