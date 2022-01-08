import {ChromeCookieManager, validUrl} from "../../chrome/ChromeCookie";
import {AsyncAlfredCache} from "../../alfred/AlfredCache";
import axios from "axios";
import {AlfredWorkFlow} from "../../alfred/Alfred";
import {AlfredItem, Icon} from "../../alfred/AlfredItem";
import {AlfredLogger} from "../../alfred/AlfredLogger";
import {AWorkResult} from "./type";

class AWork {

    public static A_WORK_URL = ''

    public static A_WORK_CACHE_KEY = "work_alibaba_inc_com_xs"

    public static defaultIcon: Icon = {path: `${process.env.PWD}/awork.png`}

    public static log = AlfredLogger.getLogger()

    @AsyncAlfredCache(() => AWork.A_WORK_CACHE_KEY)
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
            console.log(JSON.stringify(res.data))
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
                item.icon = AWork.defaultIcon
                alfredItems.push(item)
            }
        }
        const links = result?.content?.items?.all_results?.link?.results;
        if (links) {
            for (let link of links) {
                const title = `${link.body}`;
                const item = new AlfredItem(title, link.description);
                item.icon = AWork.defaultIcon
                alfredItems.push(item)
            }
        }
        return alfredItems
    }
}

const aWorkScript = async () => {
    const cookie = await AWork.getCookie(AWork.A_WORK_URL);
    let queryResult = await AWork.query(AWork.A_WORK_URL, cookie, process.argv[2]);

    //
    if (queryResult.hasError) {
        // todo: redirect to get
        // since: cookie is expired
    }
    const alfredItems = AWork.parseResults(queryResult);
    console.log("results is", JSON.stringify(queryResult))

    const workFlow = new AlfredWorkFlow();
    workFlow.addItems(alfredItems)

    workFlow.sendFeedback()
}

aWorkScript()