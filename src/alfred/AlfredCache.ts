import * as fs from 'fs'
import {AlfredLogger} from "./AlfredLogger";
import {AlfredEnv} from "./AlfredEnv";

const logger = AlfredLogger.getLogger();

function alfredCache(keyGenerator?: (...args: any) => string, maxAge: number = 60) {
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
            let cachePath = AlfredEnv.getCachePath();
            if (!cachePath) {
                cachePath = `${process.env.HOME}/.alfredts/cache/`
                logger.info("alfred cache path is not define so use the default one {}", cachePath)
            }


            if (!fs.existsSync(cachePath)) {
                logger.info("the first time to cache")
                fs.mkdirSync(cachePath, {recursive: true});
            }

            const cacheFile = cachePath + cacheKey

            fs.exists(cacheFile, (exists) => {
                if (!exists) {
                    logger.log('{} does not exist,{}', cacheFile);
                    const result = originalFun.apply(originalFun, arguments);
                    fs.writeFileSync(cacheFile, JSON.stringify(result), {encoding: 'utf8', flag: 'w'})
                    return result;
                }

                fs.stat(cacheFile, (err, stat) => {
                    const delta = Date.now() - stat.mtimeMs;

                    if (delta > maxAge * 1000) {
                        logger.info("has been expired {}", cacheFile)
                        const result = originalFun.apply(originalFun, arguments);
                        fs.writeFileSync(cacheFile, JSON.stringify(result), {encoding: 'utf8', flag: 'w'})
                        return result;
                    }


                    const result = fs.readFileSync(cacheFile, {encoding: "utf-8", flag: 'r'});
                    return JSON.parse(result)
                })
            })
        }
        return propDesc
    }
}