import React from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";
import API from "../utils/API";
import PathInfo from "./path-info";
import PathMap from "./path-map";

/**
 * Properties type for PathPage
 */
interface PathPageProps {
    clues: Map<number, Clue>;
    clueLists: Set<string>;
    currentPath: number;
    updatePage(type: PageTypes): void;
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

    constructor(props: PathPageProps) {
        super(props);
        this.state = {
            pathName: "",
            pathClues: [],
        }
        this.setSelection = this.setSelection.bind(this);
        this.updateInfo = this.updateInfo.bind(this);

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
    setSelection(id: number) {
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
     * Render the component
     */
    render() {
        return (
            <div className="path-page-container" >
                <PathInfo pathName={this.state.pathName} pathClues={this.state.pathClues} updatePage={this.props.updatePage}
                    select={this.setSelection} selected={this.state.selected} currentPath={this.props.currentPath} updateInfo={this.updateInfo} />
                <PathMap clues={Array.from(this.props.clues.values())} clueLists={this.props.clueLists} pathClues={this.state.pathClues}
                    select={this.setSelection} selected={this.state.selected} currentPath={this.props.currentPath}
                    updateInfo={this.updateInfo} />
            </div>
        )
    }
}