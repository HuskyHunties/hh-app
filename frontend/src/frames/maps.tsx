import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { Clue, Place } from "./clue-frame";
import "../css/maps.css"


/**
 * Properties type for the search panel component.
 */
interface SearchPanelProps {

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


    render() {
        return (
            <div className="search-panel"></div>
        )
    }
}

/**
 * Properties type for the clue map Component
 */
interface ClueMapProps {
    clues: Map<number, Clue>;
    selected?: number;
    select(id: number): void;
}

/**
 * State type for the clue map Component
 */
interface ClueMapState {
    center: Place;
    fullscreen: boolean;
    sidePanel: boolean;
}

/**
 * A class to represent a clue map component. Display a given list of ClueIDs on a map.
 */
export default class ClueMap extends React.Component<ClueMapProps, ClueMapState> {
    static libraries = ["places"];

    constructor(props: ClueMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 },
            fullscreen: false,
            sidePanel: false
        }
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
                <SearchPanel />
                <div className="side-handle" style={{ left: "20%" }}
                    onClick={() => this.setState({ sidePanel: false })}>&lt;</div>
            </div>)
        } else {
            sidePanel = <div className="side-handle"
                onClick={() => this.setState({ sidePanel: true })}>&gt;</div>
        }

        const markers = Array.from(this.props.clues, ([id, clue]) => {
            return <Marker key={id} position={clue.place} onClick={() => this.props.select(id)}>
                {id === this.props.selected ?
                    <InfoWindow>
                        <div>
                            <h1>{clue.list + clue.num + ": " + clue.name}</h1>
                            {clue.desc}
                        </div>
                    </InfoWindow> : ""}
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
                        zoom={13} options={options}>

                        <div className="fullscreen-control" onClick={() => this.setState({
                            fullscreen: !this.state.fullscreen,
                            sidePanel: !this.state.fullscreen
                        })}>
                            {this.state.fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        </div>

                        {markers}

                        <Autocomplete>
                            <input
                                type="text"
                                placeholder="Customized your placeholder"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: `240px`,
                                    height: `32px`,
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    position: "absolute",
                                    left: "50%",
                                    marginLeft: "-120px"
                                }}
                            />

                        </Autocomplete>

                        {sidePanel}

                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}

