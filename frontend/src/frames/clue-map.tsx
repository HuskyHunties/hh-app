import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Clue, Place } from "./clue-frame";
import SearchPanel from "./map-search"
import "../css/maps.css"


/**
 * Properties type for the clue map Component
 */
interface ClueMapProps {
    clues: Clue[];
    selected?: number | string;
    select(id?: number | string): void;
}

/**
 * State type for the clue map Component
 */
interface ClueMapState {
    center: Place;
    fullscreen: boolean;
    sidePanel: boolean;
    searchedPlaces: google.maps.places.PlaceResult[];
}

/**
 * A class to represent a clue map component. Display a given list of ClueIDs on a map.
 */
export default class ClueMap extends React.Component<ClueMapProps, ClueMapState> {
    private map?: google.maps.Map<Element>;
    private static libraries = ["places", "geometry"];

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
                <SearchPanel map={this.map} setPlaces={this.setSearchedPlaces} places={this.state.searchedPlaces} 
                select={this.props.select} selected={this.props.selected} />
                <div className="side-handle" style={{ left: "20%" }}
                    onClick={() => this.setState({ sidePanel: false })}>&lt;</div>
            </div>)
        } else {
            sidePanel = <div className="side-handle"
                onClick={() => this.setState({ sidePanel: true })}>&gt;</div>
        }

        const markers = this.props.clues.map((clue) => {
            return <Marker key={clue.id} position={clue.place} onClick={() => this.props.select(clue.id)} label={clue.list + clue.num}>
                {clue.id === this.props.selected ?
                    <InfoWindow onCloseClick={() => this.props.select(undefined)}>
                        <div>
                            <h1>{clue.list + clue.num + ": " + clue.name}</h1>
                            {clue.desc}
                        </div>
                    </InfoWindow> : ""}
            </Marker>
        })

        const searchResults = this.state.searchedPlaces.map((place) => {
                return <Marker key={place.place_id} position={place.geometry?.location!} onClick={() => this.props.select(place.place_id!)}>
                    {place.place_id === this.props.selected ?
                        <InfoWindow onCloseClick={() => this.props.select(undefined)}>
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

                        {searchResults}

                        {sidePanel}

                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}

