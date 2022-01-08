type Action = string | string[] | { text?: string | string[], url?: string, file?: string, auto?: string }
type Icon = { type?: "fileicon" | "filetype" | undefined; path: string }

/**
 * @see https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
 */
export class AlfredItem {
    /**
     * unique identifier for the item
     * help to subsequent sorting and ordering
     * usually ignore it
     */
    uid?: string

    /**
     * the type of which the result row will point to.
     * if the type is `file` the alfred will check the existence of it
     * and this will have a very small performance implication.
     *
     * if you don't want alfred do the performance implication checking
     * set it as the `file:skipcheck`
     *
     * most often just let it as it is
     */
    type?: 'default' | 'file' | 'file:skipcheck' = 'default'

    /**
     * the title displayed in result row of alfred window
     */
    title: string

    /**
     * the subtitle(smaller) displayed
     */
    subtitle: string

    /**
     * the icon displayed in result row
     * if the type is omitted, the alfred will load the file from the path to show
     * otherwise the icon of the file will be shown
     * type
     */
    icon?: { type?: 'fileicon' | 'filetype' | undefined, path: string }

    /**
     * if valid is set and as true the action will be triggered when return pressed
     * otherwise no action
     * by default it is true
     */
    valid?: boolean = true

    /**
     * @since alfred 3.5
     * @see math mode option in alfred result filter
     * if this set as `my family photo` and math mode set
     * this match will be used to match the query instead of
     * the title
     */
    match?: string

    /**
     * @since alfred 3.4.1
     * you can define a valid modifier(command) with the arg and subtitle.
     * when the modifier pressed the subtitle will be displayed in the result row
     * when the modifier and return pressed the arg will be used in later action
     *
     * {
     *   cmd: {
     *       valid:true|false,
     *       arg:'args used in next action',
     *       subtitle:'subtitle show in the result row'
     *   }
     * }
     */
    mods?: {}

    /**
     * the default arg of the item result row that will be passed through
     * the workflow to the output action.
     *
     * when return pressed, and it is valid then the arg will be passed
     */
    arg?: string

    /**
     * @since alfred 4.5
     * this action can override the arg of the item
     *
     * when universal action(right arrow by default in alfred when result row
     * or the global hotkey which you can redefine in universal action panel)
     * pressed the content type will automatically be derived by Alfred to file,
     * url or text.
     */
    action?: Action

    /**
     * define the text the user will get the result row with ⌘C
     * or displaying with ⌘L
     */
    text?: { copy?: string, largetype?: string }

    /**
     * A Quick Look URL which will be visible if the user uses the Quick Look feature within Alfred
     * Shift or cmd + Y
     * */
    quicklookurl?: string

    /**
     * when tab pressed the autocomplete will be put into search field
     * by default
     * if valid of the item is set to false when return pressed, so do it
     */
    autocomplete?: string

    // variables can be passed out of the script filter within a variables
    variables?: {}

    // basic constructors
    constructor(title: string,
                subtitle: string,
                uid?: string,
                type?: "default" | "file" | "file:skipcheck",
                icon?: Icon,
                valid?: boolean,
                match?: string,
                mods?: {},
                arg?: string,
                action?: Action,
                text?: { copy?: string; largetype?: string },
                quicklookurl?: string,
                autocomplete?: string,
                variables?: {}) {
        this.uid = uid;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.icon = icon;
        this.valid = valid;
        this.match = match;
        this.mods = mods;
        this.arg = arg;
        this.action = action;
        this.text = text;
        this.quicklookurl = quicklookurl;
        this.autocomplete = autocomplete;
        this.variables = variables;
    }
}