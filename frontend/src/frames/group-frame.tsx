import React, { RefObject } from "react";
import "../css/group-frame.css";
import API from "../utils/API";
import Popup, { PopupTypes } from "../utils/popup";

/**
 * Holds a name and pathID of a group
 */
export interface Group {
  name: String;
  pathID?: number;
}

/**
 * Properties type for the GroupList Component
 */
interface GroupListProps {
  groups: Map<number, Group>;
  paths: Map<number, string>;
  clickHandler(selection: number): void;
  selected: number | undefined;
}

interface GroupListState {
}

/**
 * A component that displays all of the currently created groups as a selectable list.
 */
class GroupList extends React.Component<GroupListProps, GroupListState> {
  /**
   * Renders the component
   */
  render() {
    // Map all groups ids to table cells with appropriate information.
    const groups: JSX.Element[] = [];
    this.props.groups.forEach((group, id) => {
      const path = group.pathID && this.props.paths.has(group.pathID) ? this.props.paths.get(group.pathID!) : "No assigned path";
      groups.push(
        <tr key={id} onClick={() => this.props.clickHandler(id)}>
          <td className={id === this.props.selected ? "selected" : ""}>
            {group.name + " -- " + path}
          </td>
        </tr>
      );
    });
    return (
      <div className="table-div">
        <table className="group-table">
          <thead><tr><th>List of Groups</th></tr></thead>
          <tbody>{groups}</tbody>
        </table>
      </div>
    );
  }
}

/**
 * Properties type for the GroupFrame Component
 */
interface GroupFrameProps {
  groups: Map<number, Group>;
  paths: Map<number, string>;
  updateInfo(): void;
}

/**
 * Properties type for the Group Frame Component
 */
interface GroupFrameState {
  selected: number | undefined;
}

/**
 * A component to display group information and allow operations on the groups.
 */
export default class GroupFrame extends React.Component<GroupFrameProps, GroupFrameState> {
  popupRef: RefObject<Popup>;

  constructor(props: GroupFrameProps) {
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
    if (this.state.selected && !this.props.groups.has(this.state.selected!)) {
      this.setState({selected: undefined});
    }
  }

  /**
   * Send a new group to the backend to be added and update the component's state.
   * @param name The name of a new group.
   */
  private addGroup() {
    this.popupRef.current?.popupFactory(PopupTypes.Input, "Input name for new Group").then((res: string) => {
      API.post("/groups", { name: res }).then(this.props.updateInfo, (res) => this.handleAddError(res.response.status));
      console.log("Tried to add group: " + res);
    }, () => {});
  }

  /**
   * Handles errors in the add group method
   * @param status error code for the add request
   */
  private handleAddError(status: number) {
    // TODO Actual error code for name already in use
    if (status === 400) {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "Name already in use").then(() => this.addGroup());

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Tell the backend to delete a group and update the component's state
   * @param id The id of the group to be deleted
   */
  private deleteGroup() {
    if (this.state.selected) {
      this.popupRef.current?.popupFactory(PopupTypes.Confirm, "Delete Selected Group?").then(() => {
        API.delete("groups/" + this.state.selected).then(this.props.updateInfo, (res) => this.handleDeleteError(res.response.status));
      }, () => {});
    } else {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Group Selected");
    }
  }

  /**
   * Handles errors in the delete group method
   * @param status error code for the delete request
   */
  private handleDeleteError(status: number) {
    // Item already deleted TODO Actual Error code
    if (status === 400) {
      this.props.updateInfo();

      // Unknown error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }

  }

  private assignPath() {
    if (this.state.selected) {
    this.popupRef.current?.popupFactory(PopupTypes.DropDown, "Choose a path to assign to the selected group:", this.props.paths)
      .then((res: string) => {
        API.put("groups/" + this.state.selected, { pathID: Number(res) })
        .then(this.props.updateInfo, (res) => this.handleAssignError(res.response.status, Number(res)));
        console.log("Group: " + this.state.selected + " assigned path: " + res);
      }, () => {});

    } else {
      this.popupRef.current?.popupFactory(PopupTypes.Notif, "No Group Selected");
    }
  }

  private handleAssignError(status: number, pathID: number) {
    // Path Already Assigned to another group TODO actual error code
    if (status === 400) {
      this.popupRef.current?.popupFactory(PopupTypes.Confirm, "Path already assigned to another group.  Assign anyway?")
      .then(() => {
        API.put("groups/" + this.state.selected, {pathID: pathID, override: true})
        console.log("Group: " + this.state.selected + " assigned path: " + pathID + " via override"); 
      });

      // Unknown Error
    } else {
      console.log(status);
      throw new Error("Unknown error code");
    }
  }

  /**
   * Render the component
   */
  render() {
    return (
      <div className="group-frame">
        <GroupList paths={this.props.paths} groups={this.props.groups}
          clickHandler={(id: number) => this.setState({ selected: id })}
          selected={this.state.selected}
        />
        <button className="add-group group-button" onClick={() => this.addGroup()}>Add Group</button>
        <button className="remove-group group-button" onClick={() => this.deleteGroup()}>Remove Group</button>
        <button className="assign-path group-button" onClick={() => this.assignPath()}>Assign Path</button>
        <Popup ref={this.popupRef} />
      </div>
    );
  }
}
