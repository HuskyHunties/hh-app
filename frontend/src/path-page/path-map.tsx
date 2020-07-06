import React, { RefObject } from "react";
import GLOBALSECRETS from "../secrets";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from "@react-google-maps/api";
import API from "../utils/API";
import Popup, { PopupTypes } from "../utils/popup";
import ReactDOM from "react-dom";
import urlMap from "../utils/icons";
import { Settings } from "backend/routes/settingsRouter";

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
    removeClue(): void;
    settings?: Settings;
}

/**
 * State type for the Path Map component.
 */
interface PathMapState {
    center: google.maps.LatLngLiteral;
    showPath: boolean;
}

/**
 * Shows all clues on a map and allows them to be clicked to be added to a path.
 */
export default class PathMap extends React.Component<PathMapProps, PathMapState> {
    private static libraries = ["places"];
    private map?: google.maps.Map<Element>;

    constructor(props: PathMapProps) {
        super(props);
        this.state = {
            center: { lat: 42.3406995, lng: -71.0897018 },
            showPath: true
        }

        this.handleMapLoad = this.handleMapLoad.bind(this);
    }

    /**
     * Adds the currently selected clue to the current path in the backend
     */
    addClueToPath() {
        API.put("/paths/" + this.props.currentPath + "/clue", {
            clueID: this.props.selected
        }).then(this.props.updateInfo, (res) => this.handleAddError(res.response.status));
    }

    handleAddError(err: number) {
        if (err === 401) {
            // TODO display path name
            this.props.popupRef.current?.popupFactory(PopupTypes.Confirm, "Clue already assigned to path.  Assign anyway?")
                .then(() => {
                    API.put("/paths/" + this.props.currentPath + "/clue/override", {
                        clueID: this.props.selected
                    }).then(this.props.updateInfo, (res) => this.handleAddError(res.response.status));
                })
        } else {
            console.log(err);
            throw new Error("Unknown Error Code.")
        }

    }

    handleMapLoad(map: google.maps.Map<Element>) {
        this.map = map;
        const showPathControl = <div onClick={() => this.setState({ showPath: !this.state.showPath })} className="show-path-control">
            Toggle Path
        </div>;
        const controlDiv = document.createElement("div");
        ReactDOM.render(showPathControl, controlDiv);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    }

    /**
     * Renders the component
     */
    render() {
        const options = {
            streetViewControl: false,
            fullscreenControl: false,
        };

        const pathClueIDs = this.props.pathClues.map((clue) => clue.id);
        const mapClues = this.props.clues.filter((clue) => !pathClueIDs.includes(clue.id));

        const clueMarkers = mapClues.map((clue) => {
            let icon: google.maps.Icon | undefined;
            try {
                const img = urlMap.get(this.props.settings?.colors.get(clue.list)!);
                if (img) {
                    icon = {
                        url: img!,
                        labelOrigin: new google.maps.Point(24, 16),
                        scaledSize: new google.maps.Size(48, 48)
                    }
                }
            } catch (e) { };

            return <Marker key={clue.id} position={clue.place} onClick={() => this.props.select(clue.id)}
                icon={icon} label={clue.list + clue.num}>
                {clue.id === this.props.selected ?
                    <InfoWindow>
                        <div style={{ background: "#232323" }}>
                            {clue.list + clue.num + ": " + clue.name} <br />
                            {clue.desc} <br />
                            <button onClick={() => this.addClueToPath()}>Add Clue</button>
                        </div>
                    </InfoWindow>
                    : ""}
            </Marker>
        });

        let pathMarkers: JSX.Element[] = [];
        let polylines: JSX.Element[] = [];
        if (this.state.showPath) {
            pathMarkers = this.props.pathClues.map((clue) => {
                return <Marker key={clue.id} label={clue.list + clue.num} position={clue.place} onClick={() => this.props.select(clue.id)} >
                    {clue.id === this.props.selected ?
                        <InfoWindow>
                            <div style={{ background: "#232323" }}>
                                {clue.list + clue.num + ": " + clue.name} <br />
                                {clue.desc} <br />
                                <button onClick={this.props.removeClue}>Remove Clue</button>
                            </div>
                        </InfoWindow>
                        : ""}
                </Marker>
            });

            const lineSymbol = { path: 2 }; //google.maps.SymbolPath.FORWARD_OPEN_ARROW
            const polyOptions = { icons: [{ icon: lineSymbol, offset: "100%" }], clickable: false };
            const pathCluesPlaces = this.props.pathClues.map((clue) => clue.place);
            for (let i = 0; i < this.props.pathClues.length - 1; i++) {
                polylines.push(<Polyline key={"pl" + i} path={pathCluesPlaces.slice(i, i + 2)} options={polyOptions} />)
            }

        }


        return (
            <div className="path-map-container">
                <LoadScript googleMapsApiKey={GLOBALSECRETS.mapsKey} libraries={PathMap.libraries}>
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} options={options}
                        center={this.state.center} zoom={13} onLoad={this.handleMapLoad}>
                        {clueMarkers}
                        {pathMarkers}
                        {polylines}
                    </GoogleMap>
                </LoadScript>
            </div>
        )
    }
}