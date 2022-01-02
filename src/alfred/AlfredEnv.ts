const preference = process.env.alfred_preferences!!
const theme = process.env.alfred_theme!!
const version = process.env.alfred_version!!
const bundleId = process.env.alfred_workflow_bundleid!!
const cachePath = process.env.alfred_workflow_cache!!
const dataPath = process.env.alfred_workflow_data!!
const workflowName = process.env.alfred_workflow_name!!
const isDebug = process.env.alfred_debug === '1'
const uuid = process.env.alfred_workflow_uid!!
const flowVersion = process.env.alfred_workflow_version!!

/**
 * @see https://www.alfredapp.com/help/workflows/script-environment-variables/
 */
export class AlfredEnv {
    /**
     * This is the location of the Alfred.alfred preferences. If a user has synced their settings,
     * this will allow you to find out where their settings are regardless of sync state.
     */
    public static getPreferencePath(): string {
        return preference!!
    }

    /**
     * Current theme used
     */
    public static getTheme(): string {
        return theme
    }

    /**
     * Find out which version and build the user is currently running.
     * This may be useful if your workflow depends on a particular Alfred version's features.
     */
    public static getVersion(): string {
        return version
    }

    /**
     * The bundle ID of the current running workflow
     */
    public static getBundleId(): string {
        return bundleId
    }

    /**
     * Cache: ~/Library/Caches/com.runningwithcrayons.Alfred/Workflow Data/[bundle id]
     * Note that these two will only be populated if your workflow has a bundle id set.
     * @see getBundleId()
     */
    public static getCachePath(): string {
        return cachePath
    }

    /**
     * Data: ~/Library/Application Support/Alfred/Workflow Data/[bundle id]
     * Note that these two will only be populated if your workflow has a bundle id set.
     * @see getBundleId()
     */
    public static getDataPath(): string {
        return dataPath
    }

    /**
     * Name of the currently running workflow
     */
    public static getWorkFlowName(): string {
        return workflowName
    }

    /**
     * Current workflow version
     */
    public static getWorkFlowVersion(): string {
        return flowVersion
    }

    /**
     * If the user currently has the debug panel open for this workflow.
     */
    public static isDebugMode() {
        return isDebug
    }

    /**
     * Unique ID of the currently running workflow
     */
    public static getUuid(): string {
        return uuid
    }
}
