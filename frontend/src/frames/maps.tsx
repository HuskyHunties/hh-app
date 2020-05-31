import React from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";


/**
 * Properties type for the clue map Component
 */
interface ClueMapProps {
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
        return (
            <LoadScript
                googleMapsApiKey={GLOBALSECRETS.mapsKey}
            >
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: 42.3406995, lng: -71.0897018 }}
                    zoom={16}
                >
                    <Marker
                        position={{ lat: 42.34117, lng: -71.0874334 }} />
                </GoogleMap>
            </LoadScript>
        )
    }
}

