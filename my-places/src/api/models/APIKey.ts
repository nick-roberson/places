/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface APIKey
 */
export interface APIKey {
    /**
     * 
     * @type {string}
     * @memberof APIKey
     */
    key: string;
}

/**
 * Check if a given object implements the APIKey interface.
 */
export function instanceOfAPIKey(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "key" in value;

    return isInstance;
}

export function APIKeyFromJSON(json: any): APIKey {
    return APIKeyFromJSONTyped(json, false);
}

export function APIKeyFromJSONTyped(json: any, ignoreDiscriminator: boolean): APIKey {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'key': json['key'],
    };
}

export function APIKeyToJSON(value?: APIKey | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'key': value.key,
    };
}
