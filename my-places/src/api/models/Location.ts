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
 * @interface Location
 */
export interface Location {
    /**
     * 
     * @type {number}
     * @memberof Location
     */
    lat: number;
    /**
     * 
     * @type {number}
     * @memberof Location
     */
    lng: number;
}

/**
 * Check if a given object implements the Location interface.
 */
export function instanceOfLocation(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "lat" in value;
    isInstance = isInstance && "lng" in value;

    return isInstance;
}

export function LocationFromJSON(json: any): Location {
    return LocationFromJSONTyped(json, false);
}

export function LocationFromJSONTyped(json: any, ignoreDiscriminator: boolean): Location {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lat': json['lat'],
        'lng': json['lng'],
    };
}

export function LocationToJSON(value?: Location | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lat': value.lat,
        'lng': value.lng,
    };
}
