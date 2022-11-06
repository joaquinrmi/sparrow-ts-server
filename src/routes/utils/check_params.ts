import { Fields } from "../error_response";

type ParamChecker = (param: any) => boolean;
type ParamParser<T> = (param: any) => T;
type ObjectChecker<T> = {[P in keyof T]-?: ParamChecker};
type ObjectParser<T> = {[P in keyof T]-?: ParamParser<T[P]>};

/**
 * Validates a certain number of request params or form params.
 * @param rawData The object that contains the parameters.
 * @param checkers The validators of each param.
 * @param parsers The parsers of valid params.
 * @returns an array of two objects: a list of errors and the parsered params.
 */
export function checkParams<T>(rawData: any, checkers: ObjectChecker<T>, parsers: ObjectParser<T>): [ Fields<T>, T ]
{
    let error = false;

    const fields: Fields<T> = {};
    const elements: any = {};
    for(let key in checkers)
    {
        const check = checkers[key](rawData[key]);
        if(!check) error = true;

        fields[key] = !check;
        if(!error)
        {
            elements[key] = parsers[key](rawData[key]);
        }
    }

    if(error)
    {
        return [ fields, null ];
    }
    else
    {
        return [ null, elements ];
    }
}

export function checkIdParam(id: string): boolean
{
    return typeof id === "string" && id.length > 0 && !Number.isNaN(Number(id));
}

export function checkNextToParam(nextTo?: string): boolean
{
    return nextTo === undefined || (typeof nextTo === "string" && nextTo.length > 0 && !Number.isNaN(Number(nextTo)));
}

export function checkBooleanParam(param: string): boolean
{
    return param === "true" || param === "false";
}

export function checkOptionalStringParam(param: string): boolean
{
    return param === undefined || param.length > 0;
}

export function checkOptionalNumberParam(param: string): boolean
{
    return param === undefined || (param.length > 0 && !Number.isNaN(Number(param)));
}

export function checkOptionalBooleanParam(param: string): boolean
{
    return param === undefined || checkBooleanParam(param);
}

export function parseOptionalNumberParam(param?: string): number | undefined
{
    if(param === undefined) return undefined;
    else return Number(param);
}

export function parseOptionalBooleanParam(param?: string): boolean | undefined
{
    if(param === undefined) return undefined;
    else return JSON.parse(param);
}