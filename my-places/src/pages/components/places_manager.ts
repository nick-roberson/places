import { DefaultApi, Place } from "../../api";
import getAPIClient from "./api_client";

class PlacesManager {

    api: DefaultApi;
    places: Place[];

    constructor() {
        this.api = getAPIClient();
        this.places = [];
    }

    setPlaces(places: Place[]) {
        this.places = places;
    }

    getPlaces(): Place[] {
        return this.places;
    }

    // ADD
    async addPlace(name: string, location: string): Promise<void> {
        try {
            let params = {
                name: name,
                location: location,
            };
            console.log('Adding place with params', params);
            this.api.addAddPost(params).then(() => {
                this.loadPlaces();
            });
        }
        catch (e) {
            console.error('Error adding place', e);
            throw e;
        }
    }

    // DELETE
    async removePlace(place: Place): Promise<void> {
        try {
            let params = {
                placeId: place.placeId,
                name: "",
            };
            console.log('Removing place with params', params);
            this.api.deleteDeleteDelete(params).then(() => {
                this.loadPlaces();
            });
        } catch (e) {
            console.error('Error removing place', e);
            throw e;
        }
    }

    // LOAD ALL
    async loadPlaces(): Promise<void> {
        try {
            this.api.getAllAllGet().then((places) => {
                this.setPlaces(places);
            });
        } catch (e) {
            console.error('Error loading places', e);
            throw e;
        }
    }
}

export default PlacesManager;