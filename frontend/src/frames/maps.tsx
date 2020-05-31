import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import { Clue, Place } from "./clue-frame";


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
}

/**
 * A class to represent a clue map component. Display a given list of ClueIDs on a map.
 */
export default class ClueMap extends React.Component<ClueMapProps, ClueMapState> {
    static libraries = ["places"];

    constructor(props: ClueMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 }
        }
    }

    /**
     * Renders the ClueMap.
     */
    render() {
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
            <LoadScript
                googleMapsApiKey={GLOBALSECRETS.mapsKey}
                libraries={ClueMap.libraries}
            >
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={this.state.center}
                    zoom={13}>

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

                </GoogleMap>
            </LoadScript>
        )
    }
}

