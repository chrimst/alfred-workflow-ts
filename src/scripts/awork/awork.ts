import {ChromeCookieManager, validUrl} from "../../chrome/ChromeCookie";
import {AlfredCache, AsyncAlfredCache} from "../../alfred/AlfredCache";
import axios from "axios";
import {AlfredWorkFlow} from "../../alfred/Alfred";
import {AlfredItem, Icon} from "../../alfred/AlfredItem";
import {AlfredLogger} from "../../alfred/AlfredLogger";
import {AWorkResult} from "./type";

const A_WORK_URL = ''

const A_WORK_CACHE_KEY = ""

const defaultIcon: Icon = {path: `${process.env.PWD}/awork.png`}

const log = AlfredLogger.getLogger()

class AWork {

    @AsyncAlfredCache(() => A_WORK_CACHE_KEY)
    public static async getCookie(url: string) {
        const aWorkUrl = validUrl(url);
        const cookies = await ChromeCookieManager.getCookie(aWorkUrl)
        return ChromeCookieManager.formatCookie(cookies)
    }

    public static async query(url: string, cookies: string, keyWord: string): Promise<AWorkResult> {
        return axios.get(url, {
            headers: {
                cookie: cookies
            },
            params: {
                itemNumbers: 10,
                condition: keyWord,
                historyNumbers: 10
            }
        }).then(res => {
            return res.data
        })
    }

    public static parseResults(result: AWorkResult): AlfredItem[] {
        let alfredItems = []
        const persons = result?.content?.items?.all_results?.person?.results;
        if (persons) {
            for (let person of persons) {
                const title = `${person.chineseNickname}(${person.lastName})${person.emplId}`;
                const item = new AlfredItem(title, person.deptDesc);
                item.icon = defaultIcon
                item.autocomplete = person.chineseNickname
                alfredItems.push(item)
            }
        }
        const links = result?.content?.items?.all_results?.link?.results;
        if (links) {
            for (let link of links) {
                const title = `${link.body}`;
                const item = new AlfredItem(title, link.description);
                item.icon = defaultIcon
                item.arg = link.url
                item.autocomplete = link.body
                alfredItems.push(item)
            }
        }
        const errors = result?.errors
        if (errors) {
            for (let e of errors) {
                const item = new AlfredItem(e.code, e.msg);
                item.icon = defaultIcon
                alfredItems.push(item)
            }
        }
        return alfredItems
    }

    public static async main(keyWord: string) {

        // get cookie from url
        let cookie = await AWork.getCookie(A_WORK_URL);
        let queryResult = await AWork.query(A_WORK_URL, cookie, keyWord);

        // if failed rm cache and get cookie again
        if (queryResult.hasError) {
            log.info("Invalid query result got")
            AlfredCache.expire(A_WORK_CACHE_KEY)
            cookie = await AWork.getCookie(A_WORK_URL);
            queryResult = await AWork.query(A_WORK_URL, cookie, keyWord)
        }

        const alfredItems = AWork.parseResults(queryResult);

        const workFlow = new AlfredWorkFlow();
        workFlow.addItems(alfredItems)
        workFlow.sendFeedback()
    }
}

AWork.main(process.argv[2]).catch()