import * as LoggerFactory from "log4js";
import {AlfredEnv} from "./AlfredEnv";

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
        },
        alfred: {
            appenders: ['alfredworkflw'],
            level: 'info'
        }
    }
})


export class AlfredLogger {
    public static getLogger(): LoggerFactory.Logger {
        return LoggerFactory.getLogger('alfred')
    }
}