import {ChromeCookieManager, validUrl} from "../chrome/ChromeCookie";
import {Url} from "url";
import {alfredCache} from "../alfred/AlfredCache";
import {AlfredLogger} from "../alfred/AlfredLogger";

const url = validUrl('');


class Awork {

    @alfredCache((url: Url) => {
        const v = url.hostname!!
        console.log(v);
        return "testUrl"
    })
    public getCookie(url: Url) {
        return ChromeCookieManager.getCookie(url)
    }
}
AlfredLogger.getLogger().info("cccc")
console.log(new Awork().getCookie(url))