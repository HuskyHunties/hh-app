import React from "react";
import '../css/path-frame.css';
import API from '../utils/API';
import { PopupCreator, PopupTypes } from "../utils/popup";

/**
 * Properties type for the PathList Component
 */
interface PathListProps {
    ids: number[];
    clickHandler(selection: number): void;
    selected: number | undefined;
}

/**
 * State for the PathList Component
 */
interface PathListState {

}

/**
 * A component that displays all of the currently created paths as a selectable list.
 */
class PathList extends React.Component<PathListProps, PathListState> {
    /**
     * Renders the component
     */
    render() {
        // Map all groups ids to table cells with appropriate information.
        const paths = this.props.ids.map((id, count) => {
            return (
                <tr key={id} onClick={() => this.props.clickHandler(id)}><td className={id === this.props.selected ? "selected" : ""}>
                    {"Path: " + id}
                </td></tr>
            );
        })
        return (
            <div className="table-div">
                <table className="path-table">
                    <thead><tr><th>List of Paths</th></tr></thead>
                    <tbody>{paths}</tbody>
                </table>
            </div>
        );
    }
}

/**
 * Properties type for the PathFrame Component
 */
interface PathFrameProps {
    popupFactory: PopupCreator;
}

/**
 * State type for the PathFrame Component
 */
interface PathFrameState {
    ids: number[];
    selected: number | undefined;
}

/**
 * A component to display a list of paths and allow operations on those paths.
 */
export default class PathFrame extends React.Component<PathFrameProps, PathFrameState> {
    intervalID?: NodeJS.Timeout;

    constructor(props: PathFrameProps) {
        super(props);
        this.state = {
            ids: [],
            selected: undefined
        }
        this.setIDs = this.setIDs.bind(this);
    }

    /**
     * Get the list of path ids from the database if the component will be loaded.
     */
    componentWillMount() {
        this.setIDs();

        this.intervalID = setInterval(this.setIDs, 5000);
    }

    /**
     * Stop refreshing the data when the component is unloaded.
     */
    componentWillUnmount() {
        clearInterval(this.intervalID!);
    }

    /**
     * Sets the state to a list of path ids, fetched from the backend.
     */
    async setIDs() {
        //console.log("Getting ids");
        //const ids = (await API.get("/groups", {})).data;
        //TODO: make this actually check the database!!
        this.setState({ids: [1, 2, 3, 4]});
    }

    /**
     * Send a new path to the backend to be added and update the component's state.
     * @param name The name of a new path.
     */
    async addPath(name: string) {
        API.post("/paths", {name: name}).then(this.setIDs, (res) => this.handleAddError(res))
        console.log("Tried to add path: " + name);
    }

    /**
     * Handles errors in the add path function
     * @param res the error for the add request
     */
    handleAddError(res: JSON) {
        // TODO Implement
    }

    /**
     * Tell the backend to delete a path and update the component's state
     * @param id The id of the path to be deleted
     */
    async deletePath(id: number) {
        API.delete("/paths/" + id, {}).then(this.setIDs, (res) => {throw Error(res)});
        console.log("deleted group: " + id);
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className="path-frame">
                <PathList ids={this.state.ids} clickHandler={(id: number) => this.setState({ selected: id })} selected={this.state.selected} />
                <button className="path-button" onClick={() => this.props.popupFactory(PopupTypes.Input, "Input name for new Path", (res: string) => this.addPath(res))}>Add Path</button>
                {/*TODO: Case where there is nothing selected needs to be handled*/}
                <button className="path-button" onClick={() => this.props.popupFactory(PopupTypes.Confirm, "Delete Selected Path?", undefined,() => this.deletePath(this.state.selected!))}>Delete Path</button>
                {/*TODO: this*/}
                <button className="path-button">Modify Path</button>
                {/*TODO: this*/}
                <button className="path-button">Order Path</button>
                <button className="path-button">Assign Path to Group</button>
            </div>
        )
    }
}