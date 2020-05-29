import React, { RefObject } from "react";
import '../css/path-frame.css';
import API from '../utils/API';
import Popup, { PopupTypes } from "../utils/popup";
import Axios from "axios";

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
    names: string[];
}

/**
 * A component that displays all of the currently created paths as a selectable list.
 */
class PathList extends React.Component<PathListProps, PathListState> {
    intervalID?: NodeJS.Timeout;
    constructor(props: PathListProps) {
        super(props);
        this.state = { names: [] };
        this.setNames = this.setNames.bind(this);
    }

    /**
   * Starts loading descriptions once the component is mounted.
   */
  componentDidMount() {
    this.setNames();

    this.intervalID = setInterval(this.setNames, 5000);
  }

  /**
   * Stop refreshing the data when the component is unloaded.
   */
  componentWillUnmount() {
    clearInterval(this.intervalID!);
  }


    /**
     * Sets the names in the state to match the id
     */
    setNames() {
        const reqs = this.props.ids.map((id) => API.get("/paths/" + id, {}));
        Axios.all(reqs).then((paths) => paths.map((path) => path.data.name)).then((names) => this.setState({ names: names }));
    }
    /**
     * Renders the component
     */
    render() {
        // Map all path ids to table cells with appropriate information.
        const paths = this.props.ids.map((id, count) => {
            return (
                <tr key={id} onClick={() => this.props.clickHandler(id)}><td className={id === this.props.selected ? "selected" : ""}>
                    {this.state.names[count]}
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
    private intervalID?: NodeJS.Timeout;
    private popupRef: RefObject<Popup>;

    constructor(props: PathFrameProps) {
        super(props);
        this.state = {
            ids: [],
            selected: undefined
        }
        this.setIDs = this.setIDs.bind(this);
        this.popupRef = React.createRef();
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
        const ids = (await API.get("/paths", {})).data;
        this.setState({ ids: ids.allPaths });
    }

    /**
     * Send a new path to the backend to be added and update the component's state.
     * @param name The name of a new path.
     */
    addPath(name: string) {
        API.post("/paths", { name: name }).then(this.setIDs, (res) => this.handleAddError(res))
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
        API.delete("/paths/" + id, {}).then(this.setIDs, (res) => { throw Error(res) });
        console.log("deleted group: " + id);
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className="path-frame">
                <PathList ids={this.state.ids} clickHandler={(id: number) => this.setState({ selected: id })} selected={this.state.selected} />
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