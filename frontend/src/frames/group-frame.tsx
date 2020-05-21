import React from "react";
import '../css/group-frame.css';
import API from '../utils/API';
import { PopupTypes, PopupCreator } from '../utils/popup'

/**
 * Properties type for the GroupList Component
 */
interface GroupListProps {
    ids: number[];
    clickHandler(selection: number): void;
    selected: number | undefined;
}

/**
 * A component that displays all of the currently created groups as a selectable list.
 */
class GroupList extends React.Component<GroupListProps> {
    /**
     * Renders the component
     */
    render() {
        // Map all groups ids to table cells with appropriate information.
        const groups = this.props.ids.map((id) => {
            const name = String(id); // TODO Change to database logic
            const assocPath = "No Associated Path"; //TODO  Change to database logic
            return (
                <tr key={id} onClick={() => this.props.clickHandler(id)}><td className={id === this.props.selected ? "selected" : ""}>
                    {name} -- {assocPath}
                </td></tr>
            );
        })
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
    popupFactory: PopupCreator;
}

/**
 * Properties type for the Group Frame Component
 */
interface GroupFrameState {
    ids: number[];
    selected: number | undefined;
}

/**
 * A component to display group information and allow operations on the groups.
 */
export default class GroupFrame extends React.Component<GroupFrameProps, GroupFrameState> {
    constructor(props: GroupFrameProps) {
        super(props);
        this.state = {
            ids: [],
            selected: undefined
        }
    }

    /**
     * Get the list of group ids from the database when the component is loaded.
     */
    componentDidMount() {
        this.setIDs();
    }

    /**
     * Sets the state to a list of group ids, fetched from the backend.
     */
    async setIDs() {
        const ids = (await API.get("/groups", {})).data;
        this.setState(ids);
    }

    /**
     * Send a new group to the backend to be added and update the component's state.
     * @param name The name of a new group.
     */
    async addGroup(name: string) {
        // Implement
        console.log("added Group: " + name);
    }

    /**
     * Tell the backend to delete a group and update the component's state
     * @param id The id of the group to be deleted
     */
    async deleteGroup(id: number) {
        // Implement
        console.log("deleted group: " + id);
    }


    /**
     * Render the component
     */
    render() {
        return (
            <div className="group-frame">
                <GroupList ids={this.state.ids} clickHandler={(id: number) => this.setState({ selected: id })} selected={this.state.selected} />
                <button className="add-group group-button"
                    onClick={() => this.props.popupFactory(PopupTypes.Input, "Input name for new Group", (res: string) => this.addGroup(res))}>
                    Add Group
                        </button>
                <button className="remove-group group-button"
                // Deal with case where no group selected
                    onClick={() => this.props.popupFactory(PopupTypes.Confirm, "Delete Selected Group?", undefined,() => this.deleteGroup(this.state.selected!))}>
                    Remove Group
                    </button>
            </div>
        )
    }
}