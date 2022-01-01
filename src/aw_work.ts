// import {ChromeCookieManager} from "./chrome_cookie";
// import axios from "axios";
// import {Item, AlfredWorkFlow} from "./awf";


// const url = 'https://work.alibaba-inc.com/xservice/suggestionSearch.json';


// const parseAWorkResults = (content: any) => {
//     const items = content['items'];
//     if (!items) {
//         return []
//     }

//     const itemDetails = items['all_results'];
//     if (!itemDetails) {
//         return []
//     }

//     const personResult = itemDetails['person'];
//     if (personResult) {
//         // console.log(personResult)
//         const personItems: any[] = personResult['results'];
//         return personItems;
//     }

//     return []
// }


// ChromeCookieManager.getCookie(url)
//     .then(cookies => ChromeCookieManager.formatCookie(cookies))
//     .then(it => axios.get(url, {
//         headers: {
//             cookie: it
//         },
//         params: {
//             itemNumbers:5,
//             condition: process.argv[2]
//         }
//     }))
//     .then(res => parseAWorkResults(res.data['content']))
//     .then(persons => {
//         const workFlow = new WorkFlow();
//         for (let person of persons) {
//             const item = new Item();
//             item.title = person['lastName']
//             item.subtitle = person['deptDesc']
//             item.uid = item.title
//             workFlow.addItem(item)
//         }
//         return workFlow
//     })
//     .then(wf => wf.sendFeedback())