// Workflow object
// Script filter input


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

