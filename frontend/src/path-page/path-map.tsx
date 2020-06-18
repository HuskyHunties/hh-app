import React from "react";
import GLOBALSECRETS from "../secrets";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

interface PathMapProps {
    clues: Clue[];
    clueLists: Set<string>;
    routeClues: Clue[];
}

interface PathMapState {
    center: google.maps.LatLngLiteral;
}

export default class PathMap extends React.Component<PathMapProps, PathMapState> {
    private static libraries = ["places"];

    constructor(props: PathMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 }
        }
    }


    render() {
        return (
            <div className="path-map-container">
                <LoadScript googleMapsApiKey={GLOBALSECRETS.mapsKey} libraries={PathMap.libraries}>
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={this.state.center} zoom={13} >

                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}