import * as LoggerFactory from "log4js";

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
            level: isDebug ? 'debug' : 'error'
        }
    }
})


export class AlfredLogger {
    public static getLogger(): LoggerFactory.Logger {
        return LoggerFactory.getLogger()
    }
}