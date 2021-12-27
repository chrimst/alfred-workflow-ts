import {configure, getLogger} from "log4js";

export class AwfLog {
    static {
        configure({
            appenders: {cheese: {type: "file", filename: "cheese.log", maxLogSize: 20}},
            categories: {default: {appenders: ["cheese"], level: "info"}}
        });
    }

    private static logger = getLogger("cheese")

    public static info(message: any, args: []) {
        AwfLog.logger.log(message, args)
    }
}


