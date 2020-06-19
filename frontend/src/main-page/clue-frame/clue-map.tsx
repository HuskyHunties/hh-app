import React, { RefObject } from "react";
import GLOBALSECRETS from "../../secrets";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Clue } from "./clue-frame";
import SearchPanel from "./map-search";
import "./maps.css";
import Popup, { PopupTypes } from "../../utils/popup";
import API from "../../utils/API";
import searchPin from "../../utils/map-icons/pin.png";

/**
 * Properties type for the ClueInfo Component
 */
interface ClueInfoProps {
    place?: google.maps.places.PlaceResult;
    clue?: Clue;
    clueLists: Set<string>;
    popupRef: RefObject<Popup>;
    updateClues(): void;
    setPlaces(places: google.maps.places.PlaceResult[]): void;
    select(id?: string): void;
    deleteClue(): void;
}

/**
 * State type for the ClueInfo Component
 */
interface ClueInfoState {
    name: string;
    list: string;
    num: string;
    desc: string;
}

class ClueInfo extends React.Component<ClueInfoProps, ClueInfoState> {
    private clue: boolean;

    constructor(props: ClueInfoProps) {
        super(props);
        if (props.place && !props.clue) {
            this.state = {
                name: props.place.name,
                num: "",
                desc: "",
                list: ""
            }
            this.clue = false;
        } else if (props.clue && !props.place) {
            this.state = {
                name: props.clue.name,
                list: props.clue.list,
                num: String(props.clue.num),
                desc: props.clue.desc
            }
            this.clue = true;
        } else {
            throw new Error("Must supply info box with either a clue or a place, but not both.")
        }
    }

    // onClick to add clue from the search bar or modify an existing clue
    addModifyClue() {
        if (this.state.name === "") {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue Name");
            return;
        }

        if (!this.state.num || isNaN(Number(this.state.num))) {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue Number");
            return;
        }

        if (this.clue && !this.props.clue!.place) {
            console.log(this.props.place);
            throw new Error("Something has gone horribly wrong");
        }

        if (!this.clue && !this.props.place!.geometry?.location) {
            console.log(this.props.place);
            throw new Error("Something has gone horribly wrong");
        }

        if (!this.state.list || this.state.list === "") {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Invalid Clue List");
            return;
        }

        const body = {
            name: this.state.name,
            listID: this.state.list.toUpperCase(),
            clueNumber: Number(this.state.num),
            description: this.state.desc,
            lat: this.clue ? this.props.clue!.place.lat : this.props.place!.geometry!.location.lat(),
            long: this.clue ? this.props.clue!.place.lng : this.props.place!.geometry!.location.lng(),
        }

        if (this.props.clueLists.has(body.listID)) {
            if (this.clue) {
                API.put("/clues/update/" + this.props.clue?.id, body).then(() => {
                    this.props.updateClues();
                    this.props.select(undefined);
                }, (res) => this.handleAddError(res.response.status));
            } else {
                API.post("/clues", body).then(() => {
                    this.props.updateClues();
                    this.props.select(undefined);
                    this.props.setPlaces([]);
                }, (res) => this.handleAddError(res.response.status));
            }
        } else {
            this.props.popupRef.current?.popupFactory(PopupTypes.Confirm, "List " + body.listID + " does not exist.  Should list be created?")
                .then(() => {
                    if (this.clue) {
                        API.put("/clues/update/" + this.props.clue?.id, body).then(() => {
                            this.props.updateClues();
                            this.props.select(undefined);
                        }, (res) => this.handleAddError(res.response.status));
                    } else {
                        API.post("/clues", body).then(() => {
                            this.props.updateClues();
                            this.props.select(undefined);
                            this.props.setPlaces([]);
                        }, (res) => this.handleAddError(res.response.status));
                    }
                })
        }
    }

    /**
     * Handles errors from the add clue method.
     * @param resCode the error code.
     */
    handleAddError(resCode: number) {
        if (resCode === 401) {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "There is another clue at this location.");
        }
        else if (resCode === 402) {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "There is already a solution for this clue");
        }
        else {
            // 400
            console.log(`Error: ${resCode} from unknown error`);
            throw new Error("unknown error code");
        }
    }

    /**
     * Tries to auto-submit if enter is pressed
     * @param e keypress event
     */
    handleKeypress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            this.addModifyClue();
        }
    }


    render() {
        const listArray: string[] = Array.from(this.props.clueLists).sort();
        const datalist = <datalist id="clue-lists">
            {listArray.map((list) => {
                return <option value={list} key={list} />
            })}
        </datalist>

        return <div style={{ background: "#232323" }}>
            Name: <input type="text" value={this.state.name} placeholder="Clue Name" autoFocus
                onChange={(e) => this.setState({ name: e.target.value })} 
                onKeyPress={(e) => this.handleKeypress(e)} /> <br />
            Description: <input type="text" value={this.state.desc} placeholder="Clue Description"
                onChange={(e) => this.setState({ desc: e.target.value })} 
                onKeyPress={(e) => this.handleKeypress(e)} /> <br />
            Clue List: <input list="clue-lists" value={this.state.list} style={{ width: "30px" }}
                onChange={(e) => this.setState({ list: e.target.value })} 
                onKeyPress={(e) => this.handleKeypress(e)} />
            {datalist}
            Clue Number: <input type="text" value={this.state.num} style={{ width: "30px" }}
                onChange={(e) => this.setState({ num: e.target.value })} 
                onKeyPress={(e) => this.handleKeypress(e)} /> <br />
            {this.clue ? <div>
                <button onClick={() => this.addModifyClue()}>Modify Clue</button>
                <button onClick={() => this.props.deleteClue()}>Delete Clue</button>
            </div>
                : <button onClick={() => this.addModifyClue()}>Add Clue</button>}
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
    updateClues(): void;
    deleteClue(): void;
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
    private service?: google.maps.places.PlacesService;
    public static placeRequestFields: string[] = [
        "name",
        "formatted_address",
        "icon",
        "types",
        "geometry",
      ];

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
    * Handles Clicking on a POI on the map.
    */
    handlePOIClick(event: google.maps.IconMouseEvent) {
        if (event.placeId) {
            if (!this.service) {
                this.service = new google.maps.places.PlacesService(this.map!);
            }
            event.stop();

            this.service.getDetails({
                placeId: event.placeId,
                fields: ClueMap.placeRequestFields
            }, (res, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    res.place_id = event.placeId;
                    this.setSearchedPlaces([res]);
                    this.setState({ sidePanel: true });
                    this.props.select(event.placeId);
                } else {
                    console.log(status);
                    throw new Error("Place Detail Request Failed.");
                }
            })
        }
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
                        select={this.props.select} selected={this.props.selected} popupRef={this.props.popupRef} />
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
                    key={clue.id} position={clue.place} onClick={() => this.props.select(clue.id)}
                    label={clue.list + clue.num} zIndex={0}
                >
                    {clue.id === this.props.selected ?
                        <InfoWindow onCloseClick={() => this.props.select(undefined)}>
                            <ClueInfo clue={clue} clueLists={this.props.clueLists} popupRef={this.props.popupRef}
                                updateClues={this.props.updateClues} select={this.props.select}
                                setPlaces={this.setSearchedPlaces} deleteClue={this.props.deleteClue} />
                        </InfoWindow>
                        : ""}
                </Marker>
            );
        });

        let searchResults = this.state.searchedPlaces.map((place) => {

            return (
                <Marker key={place.place_id} position={place.geometry?.location!} onClick={() => this.props.select(place.place_id!)}
                    zIndex={1} icon={searchPin}>
                    {place.place_id === this.props.selected ?
                        <InfoWindow onCloseClick={() => this.props.select(undefined)}>
                            <ClueInfo place={place} clueLists={this.props.clueLists} popupRef={this.props.popupRef}
                                updateClues={this.props.updateClues} select={this.props.select}
                                setPlaces={this.setSearchedPlaces} deleteClue={this.props.deleteClue} />
                        </InfoWindow>
                        : ""}
                </Marker>
            );
        });

        if (!this.state.sidePanel) {
            searchResults = [];
        }

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
                    <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={this.state.center} zoom={13} options={options}
                        onLoad={(map) => { this.map = map; }} onClick={(event) => this.handlePOIClick(event as google.maps.IconMouseEvent)}>
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
