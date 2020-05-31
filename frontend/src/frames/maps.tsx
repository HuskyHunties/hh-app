import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Clue } from "./clue-frame";


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

}

/**
 * A class to represent a clue map component. Display a given list of ClueIDs on a map.
 */
export default class ClueMap extends React.Component<ClueMapProps, ClueMapState> {

    constructor(props: ClueMapProps) {
        super(props);
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
            >
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: 42.3406995, lng: -71.0897018 }}
                    zoom={13}>

                    {markers}

                </GoogleMap>
            </LoadScript>
        )
    }
}

