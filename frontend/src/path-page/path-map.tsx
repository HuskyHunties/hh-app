import React, { RefObject } from "react";
import GLOBALSECRETS from "../secrets";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import API from "../utils/API";
import Popup from "../utils/popup";

/**
 * Props type for the Path Map component.
 */
interface PathMapProps {
    currentPath: number;
    clues: Clue[];
    clueLists: Set<string>;
    pathClues: Clue[];
    selected?: number;
    select(id: number): void;
    updateInfo(): void;
    popupRef: RefObject<Popup>;
}

/**
 * State type for the Path Map component.
 */
interface PathMapState {
    center: google.maps.LatLngLiteral;
}

/**
 * Shows all clues on a map and allows them to be clicked to be added to a path.
 */
export default class PathMap extends React.Component<PathMapProps, PathMapState> {
    private static libraries = ["places"];

    constructor(props: PathMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 }
        }
    }

    /**
     * Adds the currently selected clue to the current path in the backend
     */
    addClueToPath() {
        API.put("/paths/" + this.props.currentPath + "/clue", {
            clueID: this.props.selected
        }).then(this.props.updateInfo)
        // TODO handle errors
    }

    /**
     * Renders the component
     */
    render() {
        const clueMarkers = this.props.clues.map((clue) => {
            return <Marker key={clue.id} label={clue.list + clue.num} position={clue.place} onClick={() => this.props.select(clue.id)}>
                {clue.id === this.props.selected ?
                    <InfoWindow>
                        <div style={{background: "#232323"}}>
                            {clue.list + clue.num + ": " + clue.name} <br />
                            {clue.desc} <br />
                            <button onClick={() => this.addClueToPath()}>Add Clue</button>
                        </div>
                    </InfoWindow>
                    : ""}
            </Marker>
        })

        return (
            <div className="path-map-container">
                <LoadScript googleMapsApiKey={GLOBALSECRETS.mapsKey} libraries={PathMap.libraries}>
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={this.state.center} zoom={13} >
                        {clueMarkers}
                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}