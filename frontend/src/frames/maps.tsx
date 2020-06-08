import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { Clue, Place } from "./clue-frame";
import "../css/maps.css"

/**
 * A type to represent a PlaceSearchResult with a LatLng
 */
interface SearchResult extends google.maps.places.PlaceResult {
    location?: google.maps.LatLng;
}

/**
 * Properties type for the search panel component.
 */
interface SearchPanelProps {
    map?: google.maps.Map<Element>;
    setPlaces(places: SearchResult[]): void;
    places: SearchResult[];
}

/**
 * State type for the search panel component
 */
interface SearchPanelState {
}

/**
 * A class to represent a search panel component that facilitates easy searching for locations on the map.
 */
export class SearchPanel extends React.Component<SearchPanelProps, SearchPanelState> {
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
                    results.forEach((place) => {
                        this.geocoder?.geocode({ "address": place.adr_address }, (results, status) => {
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
            })
        }
    }


    render() {
        let searchResults: JSX.Element;
        if (this.props.places.length === 1) {
            searchResults = <div className="search-results">
                <h1>Selection: {this.props.places[0].name}</h1>
            </div>
        } else {
            const entries = this.props.places.map((place) => {
                return (<div className="search-entry" key={place.place_id}>
                    <h6>{place.name}</h6>
                </div>)
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

/**
 * Properties type for the clue map Component
 */
interface ClueMapProps {
    clues: Clue[];
    selected?: number | string;
    select(id: number | string): void;
}

/**
 * State type for the clue map Component
 */
interface ClueMapState {
    center: Place;
    fullscreen: boolean;
    sidePanel: boolean;
    searchedPlaces: SearchResult[];
}

/**
 * A class to represent a clue map component. Display a given list of ClueIDs on a map.
 */
export default class ClueMap extends React.Component<ClueMapProps, ClueMapState> {
    private map?: google.maps.Map<Element>;
    private static libraries = ["places"];

    constructor(props: ClueMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 },
            fullscreen: false,
            sidePanel: false,
            searchedPlaces: []
        }
        this.setSearchedPlaces = this.setSearchedPlaces.bind(this);
    }

    private setSearchedPlaces(places: google.maps.places.PlaceResult[]) {
        this.setState({ searchedPlaces: places })
    }

    /**
     * Renders the ClueMap.
     */
    render() {
        const options = {
            streetViewControl: false,
            fullscreenControl: false
        }

        let sidePanel;

        if (this.state.sidePanel) {
            sidePanel = (<div>
                <SearchPanel map={this.map} setPlaces={this.setSearchedPlaces} places={this.state.searchedPlaces} />
                <div className="side-handle" style={{ left: "20%" }}
                    onClick={() => this.setState({ sidePanel: false })}>&lt;</div>
            </div>)
        } else {
            sidePanel = <div className="side-handle"
                onClick={() => this.setState({ sidePanel: true })}>&gt;</div>
        }

        const markers = this.props.clues.map((clue) => {
            return <Marker key={clue.id} position={clue.place} onClick={() => this.props.select(clue.id)}>
                {clue.id === this.props.selected ?
                    <InfoWindow>
                        <div>
                            <h1>{clue.list + clue.num + ": " + clue.name}</h1>
                            {clue.desc}
                        </div>
                    </InfoWindow> : ""}
            </Marker>
        })

        const searchResults = this.state.searchedPlaces.map((place) => {
            return <Marker key={place.place_id} position={place.location!} onClick={() => this.props.select(place.place_id!)}>
                {place.place_id === this.props.selected ?
                    <InfoWindow>
                        <div>
                            <h1>{place.name}</h1>
                        </div>
                    </InfoWindow>
                    : ""}
            </Marker>
        })

        return (
            <div className={this.state.fullscreen ? "wrapper-fullscreen" : "wrapper-default"}>
                <LoadScript
                    googleMapsApiKey={GLOBALSECRETS.mapsKey}
                    libraries={ClueMap.libraries}
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={this.state.center}
                        zoom={13} options={options}
                        onLoad={(map) => { this.map = map }} >

                        <div className="fullscreen-control" onClick={() => this.setState({
                            fullscreen: !this.state.fullscreen,
                            sidePanel: !this.state.fullscreen
                        })}>
                            {this.state.fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        </div>

                        {markers}

                        {sidePanel}

                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}

