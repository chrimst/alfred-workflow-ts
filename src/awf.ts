// Workflow object
// Script filter input

const alfred_preferences = process.env['alfred_preferences']
const alfred_preferences_localhash = process.env['alfred_preferences_localhash']
const alfred_theme = process.env['alfred_theme']
const alfred_theme_background = process.env['alfred_theme_background']
const alfred_theme_selection_background = process.env['alfred_theme_selection_background']
const alfred_theme_subtext = process.env['alfred_theme_subtext']
const alfred_version = process.env['alfred_version']
const alfred_version_build = process.env['alfred_version_build']
const alfred_workflow_bundleid = process.env['alfred_workflow_bundleid']
const alfred_workflow_cache = process.env['alfred_workflow_cache']
const alfred_workflow_data = process.env['alfred_workflow_data']
const alfred_workflow_name = process.env['alfred_workflow_name']
const alfred_workflow_uid = process.env['alfred_workflow_uid']
const alfred_workflow_version = process.env['alfred_workflow_version']
const alfred_debug = process.env['alfred_debug']


export class Icon {
    private type: String
    private path: String

    constructor(type: String, path: String) {
        this.type = type;
        this.path = path;
    }
}

export class Item {
    uid?: string
    type?: string
    title?: string
    subtitle?: string
    arg?: string | string[]
    autocomplete?: string
    icon?: Icon
    valid?: boolean = true
    match?: string


}

export class WorkFlow {
    private items: Item[] = new Array<Item>()

    public addItem(item: Item): void {
        this.items.push(item)
    }

    public sendFeedback() {
        return console.log(JSON.stringify(this))
    }
}

