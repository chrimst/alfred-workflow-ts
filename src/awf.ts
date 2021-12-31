import * as LoggerFactory from "log4js";

// workflow env var
const prefernce = process.env.alfred_preferences!!
const theme = process.env.alfred_theme!!
const version = process.env.alfred_version!!
const bundleId = process.env.alfred_workflow_bundleid!!
const cachePath = process.env.alfred_workflow_cache!!
const dataPath = process.env.alfred_workflow_data!!
const workflowName = process.env.alfred_workflow_name!!
const isDebug = process.env.alfred_debug === '1'
const uuid = process.env.alfred_workflow_uid!!

LoggerFactory.configure({
    appenders: {
        alfredworkflw: {
            type: 'file',
            filename: `${process.env.HOME}/.alfredts/alfred_workflow_app.log`,
            maxLogSize: 50000000 // 50M
        }
    },
    categories: {
        default: {
            appenders: ['alfredworkflw'],
            level: 'info'
        }
    }
})

const logger = LoggerFactory.getLogger()

export class AlfredWorkFlow {

    private alredEnv: AlredEnv

    private items: AlfredItem[] = []

    private variables = {

    }

    constructor() {
        this.alredEnv = new AlredEnv()
    }

    public getDefaultEnv(): AlredEnv {
        return this.alredEnv
    }

    public getCustomizeEnv(varName: string) {
        if (varName.startsWith('alfred_')) {
            throw new Error("Customize variable can not use prefix like `alfred_`");
        }
        return process.env.varName
    }

    public sendFeedback(): void {
        console.log(JSON.stringify(this))
    }

    public clearItems(): void {
        this.items = []
    }

    public addItems(item: AlfredItem): void {
        this.items.push(item)
    }
}

class AlredEnv {
    public getPreferencePath(): string {
        return prefernce!!
    }

    public getTheme(): string {
        return theme
    }

    public getVersion(): string {
        return version
    }

    public getBundleId(): string {
        return bundleId
    }

    public getCachePath(): string {
        return cachePath
    }

    public getDataPath(): string {
        return dataPath
    }

    public getWorkFlowName(): string {
        return workflowName
    }

    public isDebugMode() {
        return isDebug
    }

    public getUuid(): string {
        return uuid
    }
}

/**
 * @see https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
class AlfredItem {
    // maybe used to sorted
    uid?: string
    // show in windo
    title: string
    // show in window
    subtitle: string
    // show in window
    icon?: { type?: string, path: string }
    // when invalid -> no args or other action
    valid: boolean = true
    mods?: {}
    // return => pass to next node
    arg?: string
    action?: string | string[] | {}
    text?: { copy?: string, largetype?: string }
    // shift
    quicklookurl?: string
    // tab
    autocomplete?: string
    variables?: {}
    constructor(title: string, subtitle: string) {
        this.title = title
        this.subtitle = subtitle
    }
}

// test for vars
// debug: only works on alfred env
// const flow = new AlfredWorkFlow()
// logger.info("getPreferencePath {}", flow.getPreferencePath())
// logger.info("getTheme {}", flow.getTheme())
// logger.info("getBundleId {}", flow.getBundleId())
// logger.info("getCachePath {}", flow.getCachePath())
// logger.info("getDataPath {}", flow.getDataPath())
// logger.info("getWorkFlowName {}", flow.getWorkFlowName())
// logger.info("isDebugMode {}", flow.isDebugMode())
// logger.info("getUuid {}", flow.getUuid())
// logger.info("alfred_debug {}", process.env.alfred_debug)
// logger.info("version {}", process.env.alfred_version)
// logger.info("customiz var {}", process.env.test_var)

// test for simple item feedback
// show all item info to workflow
const flow = new AlfredWorkFlow()
const v1 = new AlfredItem('uu1', 'uu2')
v1.arg = "a_this args is just to trigger the aone?" // if this configureed
// when enter return command -> universal action
// or use hot key to trigger
// this args will used
flow.addItems(v1);
flow.addItems(new AlfredItem('uu2', 'uu3'));
const v2 = new AlfredItem('uu4', 'when you use tab this auto can be filled')
v2.arg = "https://cd.aone.alibaba-inc.com/ec/app/64023/mix/publish" // this args can trigger the universial action
v2.autocomplete = 'yes the auto_complete here'
v2.mods = {
    cmd: {
        valid: true, // means this cmd is valid
        arg: ["ttest cc"]
    }
}
v2.variables = {}
flow.addItems(v2);
const cmdItem = new AlfredItem('cmd', 'cmd_can_get_my_copy_value')
cmdItem.quicklookurl = 'https://google.com'
cmdItem.text = {
    copy: 'use cmd + c => yest i am copied',
    largetype: 'what it is' // cmd + L => show these
}
cmdItem.mods = {
    cmd: {
        title: 's', // not required here
        valid: true, // means this cmd is valid
        arg: ["alfredapp.com/powerpack"], // the ars can pass
        subtitle: "https://www.alfredapp.com/powerpack/" // the titile when cmd pressed
    },
    fn: {
        title: 's', // not required here
        valid: true, // means this cmd is valid
        arg: ["alfredapp.com/powerpack"], // the ars can pass
        subtitle: "fn is pressed" // the titile when cmd pressed
    }
}
cmdItem.action = "Open"
cmdItem.arg = "https://args.com"
cmdItem.icon = {
    path: '/Users/christmc/Desktop/20211228144905.jpg' // this icon will be shown in the item
}
cmdItem.quicklookurl = '/Users/christmc/Desktop/20211228144905.jpg' // when shift or cmd+Y pressed an small window will be opened
// to show some things
// the url may path also?
// yes it can be any thing that can be previewd
cmdItem.valid = false
flow.addItems(cmdItem)
flow.sendFeedback()