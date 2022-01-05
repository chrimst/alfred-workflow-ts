import * as fs from 'fs'
import {AlfredLogger} from "./AlfredLogger";
import {AlfredEnv} from "./AlfredEnv";

const logger = AlfredLogger.getLogger();

export function alfredCache(keyGenerator?: (...args: any) => string, maxAge: number = 60) {
    return (target: any, key: string, propDesc: PropertyDescriptor) => {
        if (!keyGenerator) {
            logger.info("no logger defined {}", propDesc)
            return
        }
        const decoratedObj = propDesc.value
        if (!(decoratedObj instanceof Function)) {
            throw new Error("alfredCache must annotated on method")
        }

        if (arguments.length == 0) {
            logger.info("no arguments can used", propDesc)
            return
        }
        const originalFun: Function = decoratedObj
        propDesc.value = function (): any {
            let args = []
            for (let arg of arguments) {
                args.push(arg)
            }

            const cacheKey = keyGenerator.apply(keyGenerator, args);
            logger.info("cacheKey is", cacheKey)
            let cachePath = AlfredEnv.getCachePath();
            if (!cachePath) {
                cachePath = `${process.env.HOME}/.alfredts/cache/`
                logger.info("alfred cache path is not define so use the default one {}", cachePath)
            }


            if (!fs.existsSync(cachePath)) {
                logger.info("the first time to cache")
                fs.mkdirSync(cachePath, {recursive: true});
            }

            AlfredCache.isCacheExists(cacheKey)
                .then(exists => AlfredCache.cacheIfNotExist(cacheKey, originalFun.apply(originalFun, arguments), exists))
                .then(() => AlfredCache.isExpired(cacheKey, maxAge))
                .then(exists => AlfredCache.cacheIfNotExpired(cacheKey, originalFun.apply(originalFun, arguments), exists))
                .then(() => AlfredCache.getCache(cacheKey))
                .then((cacheData) => JSON.parse(cacheData))
        }
        return propDesc
    }
}

export class AlfredCache {

    public static cache(fileName: string, content: Promise<string>) {
        let cachePath = AlfredEnv.getCachePath();
        if (!fs.existsSync(cachePath)) {
            logger.info("the first time to cache")
            fs.mkdirSync(cachePath, {recursive: true});
        }

        const cacheFile = AlfredCache.getCacheFilePath(fileName);
        console.log(fileName + "......" + content)
        content.then((c) => fs.writeFileSync(cacheFile, c, {encoding: 'utf8', flag: 'w'}))

    }

    public static cacheIfNotExist(fileName: string, content: Promise<string>, isExist: boolean) {
        if (!isExist) {
            this.cache(fileName, content)
        }
    }

    public static cacheIfNotExpired(fileName: string, content: Promise<string>, isExist: boolean) {
        if (!isExist) {
            this.cache(fileName, content)
        }
    }

    public static getCache(fileName: string): string {
        const cacheFile = AlfredCache.getCacheFilePath(fileName);
        return fs.readFileSync(cacheFile, {encoding: "utf-8", flag: 'r'});
    }

    public static isExpired(fileName: string, maxAge: number): Promise<boolean> {
        const cacheFile = AlfredCache.getCacheFilePath(fileName);
        return new Promise((resolve, reject) => {
            fs.stat(cacheFile, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                const delta = Date.now() - stat.mtimeMs;
                return resolve(delta > maxAge * 1000)
            })
        })
    }

    public static isCacheExists(fileName: string): Promise<boolean> {
        const cacheFile = AlfredCache.getCacheFilePath(fileName);
        return new Promise((a, b) => {
            fs.exists(cacheFile, (exists) => {
                a(exists)
            })
        })
    }

    private static getCacheFilePath(fileName: string) {
        let cachePath = AlfredEnv.getCachePath();
        if (!cachePath) {
            cachePath = `${process.env.HOME}/.alfredts/cache/`
            logger.info("alfred cache path is not define so use the default one {}", cachePath)
        }
        return cachePath + fileName;
    }
}