import React, { RefObject } from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";
import API from "../utils/API";
import PathInfo from "./path-info";
import PathMap from "./path-map";
import Popup, { PopupTypes } from "../utils/popup";
import { Settings } from "backend/routes/settingsRouter";

/**
 * Properties type for PathPage
 */
interface PathPageProps {
    clues: Map<number, Clue>;
    clueLists: Set<string>;
    currentPath: number;
    updatePage(type: PageTypes): void;
    settings?: Settings;
}

/**
 * State type for PathPage
 */
interface PathPageState {
    pathName: string;
    pathClues: Clue[];
    selected?: number;
}

/**
 * A component that represents a page that allows the user to add, remove, and modify the order of clues
 * in a path.
 */
export default class PathPage extends React.Component<PathPageProps, PathPageState> {
    private intervalID?: NodeJS.Timeout;
    private popupRef: RefObject<Popup>;

    constructor(props: PathPageProps) {
        super(props);
        this.state = {
            pathName: "",
            pathClues: [],
        }

        this.popupRef = React.createRef();

        this.setSelection = this.setSelection.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.removeClue = this.removeClue.bind(this);
    }

    /**
     * Start auto refreshing the Path info
     */
    componentDidMount() {
        this.updateInfo()

        this.intervalID = setInterval(this.updateInfo, 5000);
    }

    /**
     * Stop refreshing when the component is unmounted
     */
    componentWillUnmount() {
        clearInterval(this.intervalID!);
    }

    /**
     * Sets the selected value to be the given value
     * @param id the new selection
     */
    setSelection(id?: number) {
        this.setState({
            selected: id
        })
    }

    /**
     * Updates the path and clue info from the database
     */
    updateInfo() {
        API.get("/paths/" + this.props.currentPath, {}).then((res) => {
            const pathClues = res.data.clueIDs.map((id: number) => this.props.clues.get(id));
            this.setState({
                pathName: res.data.name,
                pathClues: pathClues.flat()
            })
        })
    }

    /**
     * Removes the selected clue from the current path
     */
    removeClue() {
        if (!this.state.selected || !this.state.pathClues.map((clue) => clue.id).includes(this.state.selected)) {
            this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Clue Selected");
            return;
        }

        API.delete("/paths/" + this.props.currentPath + "/clue/" + this.state.selected).then(() => {
            this.updateInfo();
            this.setSelection(undefined);
        },
            (res) => this.handleRemoveError(res.response.status))
    }

    /**
     * Handles errors in the removeClue API request
     * @param err the error code
     */
    handleRemoveError(err: number) {
        // Clue already removed
        if (err === 400) {
            this.updateInfo();
            this.setSelection(undefined);
        } else {
            console.log(err);
            throw new Error("Unknown Error Code");
        }
    }

    /**
     * Render the component
     */
    render() {
        return (
            <div className="path-page-container" >
                <PathInfo pathName={this.state.pathName} pathClues={this.state.pathClues} updatePage={this.props.updatePage}
                    select={this.setSelection} selected={this.state.selected} currentPath={this.props.currentPath} updateInfo={this.updateInfo}
                    popupRef={this.popupRef} removeClue={this.removeClue} />
                <PathMap clues={Array.from(this.props.clues.values())} clueLists={this.props.clueLists} pathClues={this.state.pathClues}
                    select={this.setSelection} selected={this.state.selected} currentPath={this.props.currentPath}
                    updateInfo={this.updateInfo} popupRef={this.popupRef} removeClue={this.removeClue} settings={this.props.settings} />
                <Popup ref={this.popupRef} />
            </div>
        )
    }
}