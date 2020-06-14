import React, { RefObject } from "react";
import "./path-frame.css";
import API from "../../utils/API";
import Popup, { PopupTypes } from "../../utils/popup";
import { PageTypes } from "../..";

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
interface PathListState {}

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
      paths.push(
        <tr key={id} onClick={() => this.props.clickHandler(id)}>
          <td className={id === this.props.selected ? "selected" : ""}>
            {name}
          </td>
        </tr>
      );
    });
    return (
      <div className="table-div">
        <table className="path-table">
          <thead>
            <tr>
              <th>List of Paths</th>
            </tr>
          </thead>
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
  updatePage(type: PageTypes, routeID?: number): void;
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
      selected: undefined,
    };
    this.popupRef = React.createRef();
  }

  /**
   * Clears the selected value if the selected value has been deleted
   */
  componentDidUpdate() {
    if (this.state.selected && !this.props.paths.has(this.state.selected!)) {
      this.setState({ selected: undefined });
    }
  }

  /**
   * Send a new path to the backend to be added and update the component's state.
   * @param name The name of a new path.
   */
  addPath() {
    this.popupRef.current
      ?.popupFactory(PopupTypes.Input, "Input name for new Path")
      .then(
        (res: string) => {
          API.post("/paths", { name: res }).then(this.props.updateInfo, (res) =>
            this.handleAddError(res.response.status)
          );
          console.log("Tried to add path: " + res);
        },
        () => {}
      );
  }

  /**
   * Handles errors in the add path function
   * @param status error code for the add request
   */
  handleAddError(status: number) {
    // TODO Actual error code for name already in use
    if (status === 400) {
      this.popupRef.current
        ?.popupFactory(PopupTypes.Notif, "Name already in use")
        .then(() => this.addPath());

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Tell the backend to delete a path and update the component's state
   */
  deletePath() {
    if (this.state.selected) {
      this.popupRef.current
        ?.popupFactory(PopupTypes.Confirm, "Delete Selected Path?")
        .then(
          () => {
            API.delete("/paths/" + this.state.selected, {}).then(
              this.props.updateInfo,
              (res) => this.handleDeleteError(res.response.status)
            );
            console.log("deleted path: " + this.state.selected);
          },
          () => {}
        );
    } else {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Path Selected");
    }
  }

  /**
   * Handles errors in the delete path function
   * @param status error code for the delete request
   */
  handleDeleteError(status: number) {
    // Item already deleted TODO Actual Error code
    if (status === 400) {
      this.props.updateInfo();

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Tell the backend to delete a path and update the component's state
   * TODO implement
   */
  modifyPath() {
    if (this.state.selected) {
      this.props.updatePage(PageTypes.ROUTES, this.state.selected);
    } else {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Path Selected");
    }
  }

  /**
   * Handles errors in the modify path function
   * @param status error code for the modify request
   */
  handleModifyError(status: number) {
    // TODO Actual Error code
    if (status === 400) {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "Implement me");

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Tell the backend to order the selected path and update the component's state
   * TODO Implement
   */
  orderPath() {
    if (this.state.selected) {
      this.popupRef.current?.popupFactory(
        PopupTypes.Notif,
        "Operation Not Implemented"
      );
    } else {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Path Selected");
    }
  }

  /**
   * Handles errors in the order path function
   * @param status error code for the order request
   */
  handleOrderError(status: number) {
    // TODO Actual Error codes
    if (status === 400) {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "Implement me");

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Renders the component.
   */
  render() {
    //console.log(this.props.paths);
    return (
      <div className="path-frame">
        <PathList
          paths={this.props.paths}
          clickHandler={(id: number) => this.setState({ selected: id })}
          selected={this.state.selected}
        />
        <button className="path-button" onClick={() => this.addPath()}>
          Add Path
        </button>
        <button className="path-button" onClick={() => this.deletePath()}>
          Delete Path
        </button>
        <button className="path-button" onClick={() => this.modifyPath()}>
          Modify Path
        </button>
        <button className="path-button" onClick={() => this.orderPath()}>
          Order Path
        </button>
        <Popup ref={this.popupRef} />
      </div>
    );
  }
}
