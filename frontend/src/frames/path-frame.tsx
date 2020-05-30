import React, { RefObject } from "react";
import '../css/path-frame.css';
import API from '../utils/API';
import Popup, { PopupTypes } from "../utils/popup";

/**
 * Properties type for the PathList Component
 */
interface PathListProps {
    paths: Map<number, string>;
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
        // Map all path ids to table cells with appropriate information.
        const paths: JSX.Element[] = [];
        this.props.paths.forEach((name, id) => {
            return (
                <tr key={id} onClick={() => this.props.clickHandler(id)}><td className={id === this.props.selected ? "selected" : ""}>
                    {name}
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
    paths: Map<number, string>;
    updateInfo(): void;
}

/**
 * State type for the PathFrame Component
 */
interface PathFrameState {
    selected: number | undefined;
}

/**
 * A component to display a list of paths and allow operations on those paths.
 */
export default class PathFrame extends React.Component<PathFrameProps, PathFrameState> {
    private popupRef: RefObject<Popup>;

    constructor(props: PathFrameProps) {
        super(props);
        this.state = {
            selected: undefined
        }
        this.popupRef = React.createRef();
    }

    /**
     * Send a new path to the backend to be added and update the component's state.
     * @param name The name of a new path.
     */
    addPath(name: string) {
        API.post("paths", { name: name }).then(this.props.updateInfo, (res) => this.handleAddError(res))
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
    deletePath(id: number) {
        API.delete("paths/" + id, {}).then(this.props.updateInfo, (res) => { throw Error(res) });
        console.log("deleted path: " + id);
    }

    /**
     * Renders the component.
     */
    render() {
        //console.log(this.props.paths);
        return (
            <div className="path-frame">
                <PathList paths={this.props.paths} clickHandler={(id: number) => this.setState({ selected: id })} selected={this.state.selected} />
                <button className="path-button" onClick={() => this.popupRef.current?.popupFactory(PopupTypes.Input, "Input name for new Path").then((res: string) => this.addPath(res))}>Add Path</button>
                {/*TODO: Case where there is nothing selected needs to be handled*/}
                <button className="path-button" onClick={() => this.popupRef.current?.popupFactory(PopupTypes.Confirm, "Delete Selected Path?").then(() => this.deletePath(this.state.selected!))}>Delete Path</button>
                {/*TODO: this*/}
                <button className="path-button">Modify Path</button>
                {/*TODO: this*/}
                <button className="path-button">Order Path</button>
                <Popup ref={this.popupRef} />
            </div>
        )
    }
}