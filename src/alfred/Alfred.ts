import {AlfredEnv} from "./AlfredEnv";
import {AlfredItem} from "./AlfredItem";


/**
 *
 */
export class AlfredWorkFlow {

    private readonly alfredEnv: AlfredEnv

    private resultItems: AlfredItem[] = []

    constructor() {
        this.alfredEnv = new AlfredEnv()
    }

    public getDefaultEnv(): AlfredEnv {
        return this.alfredEnv
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
        this.resultItems = []
    }

    public addItems(item: AlfredItem): void {
        this.resultItems.push(item)
    }
}