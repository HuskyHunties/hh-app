import React, { RefObject } from "react";
import GLOBALSECRETS from "../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Clue } from "./clue-frame";
import SearchPanel from "./map-search";
import "../css/maps.css";
import Popup, { PopupTypes } from "../utils/popup";
import API from "../utils/API";

/**
 * Properties type for the AddClue Component
 */
interface AddClueProps {
    place: google.maps.places.PlaceResult;
    clueLists: Set<string>;
    popupRef: RefObject<Popup>;
}

/**
 * State type for the AddClue Component
 */
interface AddClueState {
    name: string;
    list?: string;
    num: string;
    desc: string;
}

class AddClue extends React.Component<AddClueProps, AddClueState> {
    constructor(props: AddClueProps) {
        super(props);
        this.state = {
            name: props.place.name,
            num: "",
            desc: ""
        }
    }

    // onClick to add clue from the search bar
    addClue() {
        if (this.state.name === "") {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue Name");
            return;
        }

        if (!this.state.num || isNaN(Number(this.state.num))) {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue Number");
            return;
        }

        if (!this.props.place.geometry?.location) {
            console.log(this.props.place);
            throw new Error("Something has gone horribly wrong");
        }

        if (!this.state.list || this.state.list === "") {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue List");
            return;
        }

        const list = this.state.list.toUpperCase();
        const number = Number(this.state.num);

        if (this.props.clueLists.has(list)) {
            API.post("/clues", {
                name: this.state.name,
                listID: list,
                clueNumber: number,
                description: this.state.desc,
                lat: this.props.place.geometry?.location.lat(),
                long: this.props.place.geometry?.location.lng(),
            }).then(() => {}, (res) => this.handleError(res.response.status));
        } else {
            this.props.popupRef.current?.popupFactory(PopupTypes.Confirm, "List " + list + " does not exist.  Should list be created?")
            .then(() => {
                API.post("/clues", {
                    name: this.state.name,
                    listID: list,
                    clueNumber: number,
                    description: this.state.desc,
                    lat: this.props.place.geometry?.location.lat(),
                    long: this.props.place.geometry?.location.lng(),
                }).then(() => {}, (res) => this.handleError(res.response.status));
            })
        }
    }

    /**
     * Handles errors from the add clue method.
     * @param resCode the error code.
     */
    handleError(resCode: number) {
        if(resCode === 401){
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "This clue's location already exists.");
        }
        else if(resCode === 402){
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "This clue list and number already exists.");
        }
        else{
            // 400
            console.log(`Error: ${resCode} from unknown error`);
            throw new Error("unknown error code");
        }
    }


    render() {
        const listArray: string[] = Array.from(this.props.clueLists).sort();
        const datalist = <datalist id="clue-lists">
            {listArray.map((list) => {
                return <option value={list} />
            })}
        </datalist>

        return <div style={{ background: "#232323" }}>
            Name: <input type="text" value={this.state.name} placeholder="Clue Name"
                onChange={(e) => this.setState({ name: e.target.value })} /> <br />
            Description: <input type="text" value={this.state.desc} placeholder="Clue Description"
                onChange={(e) => this.setState({ desc: e.target.value })} /> <br />
            Clue List: <input list="clue-lists" value={this.state.list} style={{width: "30px"}}
                onChange={(e) => this.setState({ list: e.target.value })} />
            {datalist}
            Clue Number: <input type="text" value={this.state.num} style={{width: "30px"}}
                onChange={(e) => this.setState({ num: e.target.value })} /> <br />
            <button onClick={() => this.addClue()}>AddClue</button>
        </div>
    }
}


/**
 * Properties type for the clue map Component
 */
interface ClueMapProps {
    clues: Clue[];
    selected?: number | string;
    select(id?: number | string): void;
    clueLists: Set<string>;
    popupRef: RefObject<Popup>;
}

/**
 * State type for the clue map Component
 */
interface ClueMapState {
    center: google.maps.LatLngLiteral;
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
            searchedPlaces: [],
        };
        this.setSearchedPlaces = this.setSearchedPlaces.bind(this);
    }

    private setSearchedPlaces(places: google.maps.places.PlaceResult[]) {
        this.setState({ searchedPlaces: places });
    }

    /**
     * Renders the ClueMap.
     */
    render() {
        const options = {
            streetViewControl: false,
            fullscreenControl: false,
        };

        let sidePanel;

        if (this.state.sidePanel) {
            sidePanel = (
                <div>
                    <SearchPanel map={this.map} setPlaces={this.setSearchedPlaces} places={this.state.searchedPlaces}
                        select={this.props.select} selected={this.props.selected} />
                    <div className="side-handle" style={{ left: "20%" }} onClick={() => this.setState({ sidePanel: false })}>
                        &lt;
          </div>
                </div>
            );
        } else {
            sidePanel = (
                <div className="side-handle" onClick={() => this.setState({ sidePanel: true })}>
                    &gt;
                </div>
            );
        }

        const markers = this.props.clues.map((clue) => {
            return (
                <Marker
                    key={clue.id}
                    position={clue.place}
                    onClick={() => this.props.select(clue.id)}
                    label={clue.list + clue.num}
                >
                    {clue.id === this.props.selected ? (
                        <InfoWindow onCloseClick={() => this.props.select(undefined)}>
                            <div>
                                <h1>{clue.list + clue.num + ": " + clue.name}</h1>
                                {clue.desc}
                            </div>
                        </InfoWindow>
                    ) : (
                            ""
                        )}
                </Marker>
            );
        });

        const searchResults = this.state.searchedPlaces.map((place) => {

            return (
                <Marker
                    key={place.place_id}
                    position={place.geometry?.location!}
                    onClick={() => this.props.select(place.place_id!)}
                >
                    {place.place_id === this.props.selected ? (
                        <InfoWindow onCloseClick={() => this.props.select(undefined)}>
                            {<AddClue place={place} clueLists={this.props.clueLists} popupRef={this.props.popupRef} />}
                        </InfoWindow>
                    ) : (
                            ""
                        )}
                </Marker>
            );
        });

        return (
            <div
                className={
                    this.state.fullscreen ? "wrapper-fullscreen" : "wrapper-default"
                }
            >
                <LoadScript
                    googleMapsApiKey={GLOBALSECRETS.mapsKey}
                    libraries={ClueMap.libraries}
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={this.state.center}
                        zoom={13}
                        options={options}
                        onLoad={(map) => {
                            this.map = map;
                        }}
                    >
                        <div
                            className="fullscreen-control"
                            onClick={() =>
                                this.setState({
                                    fullscreen: !this.state.fullscreen,
                                    sidePanel: !this.state.fullscreen,
                                })
                            }
                        >
                            {this.state.fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        </div>

                        {markers}

                        {searchResults}

                        {sidePanel}
                    </GoogleMap>
                </LoadScript>
            </div>
        );
    }
}
