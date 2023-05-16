interface RootResponse {
    readonly success: boolean;
    readonly status: number;
}

interface ProcessFailed extends RootResponse {
    readonly success: false;
}

interface ProcessSuccessValid<T> extends RootResponse {
    readonly success: true;
    readonly result: T;
}

interface ProcessSuccessVoid extends RootResponse {
    readonly success: true;
}

export type ProcessResponse<T = void> =
    Promise<ProcessFailed | (T extends void ? ProcessSuccessVoid : ProcessSuccessValid<T>)>;