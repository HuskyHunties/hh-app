import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import "../css/maps.css"

/**
 * A type to represent a PlaceSearchResult with a LatLng
 */
export interface SearchResult extends google.maps.places.PlaceResult {
    location?: google.maps.LatLng;
}

/**
 * Properties type for the search panel component.
 */
interface SearchPanelProps {
    map?: google.maps.Map<Element>;
    setPlaces(places: SearchResult[]): void;
    places: SearchResult[];
    select(id: string): void;
    selected?: string | number;
}

/**
 * State type for the search panel component
 */
interface SearchPanelState {
}

/**
 * A class to represent a search panel component that facilitates easy searching for locations on the map.
 */
export default class SearchPanel extends React.Component<SearchPanelProps, SearchPanelState> {
    autocomplete?: google.maps.places.Autocomplete;
    service?: google.maps.places.PlacesService;
    geocoder?: google.maps.Geocoder;


    /**
     * Handles the user either selecting a place from the list, or searching for a term.
     */
    private onPlaceChanged(place: SearchResult) {
        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }


        if (Object.entries(place).length === 1) {
            const request: google.maps.places.TextSearchRequest = {
                query: place.name,
                bounds: this.props.map?.getBounds()!,
            }

            if (!this.service) {
                this.service = new google.maps.places.PlacesService(this.props.map!);
            }

            this.service.textSearch(request, (results: SearchResult[], status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    results.slice(0, 10).forEach((place) => {
                        this.geocoder?.geocode({ "placeId": place.place_id }, (results, status) => {
                            if (status === google.maps.GeocoderStatus.OK) {
                                place.location = results[0].geometry.location;
                            } else {
                                console.log(status);
                                throw new Error("Geocode failed")
                            }
                        })
                    })

                    this.props.setPlaces(results);
                } else {
                    console.log(status);
                    throw new Error("Places Search Request Failed");

                }

            })

        } else {
            this.geocoder.geocode({ 'address': place.adr_address }, (results, status) => {
                if (status !== "OK") {
                    console.log(status);
                    throw new Error("Geocode failed")
                }
                place.location = results[0].geometry.location;
                this.props.setPlaces([place])
                this.props.select(place.place_id!)
            })
        }
    }


    render() {
        let searchResults: JSX.Element;
        if (this.props.places.length === 1) {
            searchResults = <div className="search-results">
                <h1>Selection: {this.props.places[0].name}</h1>
            </div>;
        } else {
            const entries = this.props.places.map((place) => {
                if (place.location) {
                    return (<div className={this.props.selected === place.place_id ? "search-entry selected" : "search-entry"} 
                    key={place.place_id} onClick={() => this.props.select(place.place_id!)}>
                        <h6>{place.name}</h6>
                    </div>)
                } else {
                    return <div key={place.place_id}></div>
                }
            })

            searchResults = <div className="search-results">
                {entries}
            </div>
        }

        return (
            <div className="search-panel">
                <Autocomplete onLoad={(ref) => this.autocomplete = ref} onPlaceChanged={
                    () => this.onPlaceChanged(this.autocomplete!.getPlace())
                } bounds={this.props.map?.getBounds()!}>
                    <input
                        type="text"
                        placeholder="Search"
                        style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `100%`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: "absolute",
                            left: "0%",
                            marginLeft: "0px"
                        }}
                    />
                </ Autocomplete>

                {searchResults}
            </div>
        )
    }
}