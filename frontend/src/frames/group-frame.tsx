import React from "react";
import '../css/group-frame.css';
import API from '../utils/API';
import { PopupTypes, PopupCreator } from '../utils/popup';
import Axios from 'axios';

/**
 * Properties type for the GroupList Component
 */
interface GroupListProps {
    ids: number[];
    clickHandler(selection: number): void;
    selected: number | undefined;
}

interface GroupListState {
    desc: string[];
}

/**
 * A component that displays all of the currently created groups as a selectable list.
 */
class GroupList extends React.Component<GroupListProps, GroupListState> {
    intervalID?: NodeJS.Timeout;

    constructor(props: GroupListProps) {
        super(props);
        this.state = {desc: []};
        this.setDesc = this.setDesc.bind(this);
    }

    componentDidMount() {
        this.setDesc();

        this.intervalID = setInterval(this.setDesc, 5000);
    }

    /**
     * Stop refreshing the data when the component is unloaded.
     */
    componentWillUnmount() {
        clearInterval(this.intervalID!);
    }

    /**
     * Sets the state to have proper descriptions for each id.
     */
    setDesc() {
        // TODO Make Path Name instead of ID
        const reqs = this.props.ids.map((id) => API.get("/groups/" + id, {}));
        Axios.all(reqs).then((groups) => {
            return groups.map((group) => group.data.name + " -- " + (group.data.pathID ? "Path: " + group.data.pathID : "No Associated path"));
        }).then((descs) => this.setState({desc: descs}));
    }
    
    /**
     * Renders the component
     */
    render() {
        // Map all groups ids to table cells with appropriate information.
        const groups = this.props.ids.map((id, count) => {
            return (
                <tr key={id} onClick={() => this.props.clickHandler(id)}><td className={id === this.props.selected ? "selected" : ""}>
                    {this.state.desc[count]}
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
    intervalID?: NodeJS.Timeout;

    constructor(props: GroupFrameProps) {
        super(props);
        this.state = {
            ids: [],
            selected: undefined
        }
        this.setIDs = this.setIDs.bind(this);
    }

    /**
     * Get the list of group ids from the database when the component is loaded.
     */
    componentDidMount() {
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
     * Sets the state to a list of group ids, fetched from the backend.
     */
    async setIDs() {
        console.log("Getting ids");
        const ids = (await API.get("/groups", {})).data;
        this.setState({ids: ids.allGroups});
    }

    /**
     * Send a new group to the backend to be added and update the component's state.
     * @param name The name of a new group.
     */
    async addGroup(name: string) {
        API.post("/groups", {name: name}).then(this.setIDs, (res) => this.handleAddError(res))
        console.log("Tried to add group: " + name);
    }

    /**
     * Handles errors in the add group function
     * @param res the error for the add request
     */
    handleAddError(res: JSON) {
        // TODO Implement
    }

    /**
     * Tell the backend to delete a group and update the component's state
     * @param id The id of the group to be deleted
     */
    async deleteGroup(id: number) {
        API.delete("/groups/" + id, {}).then(this.setIDs, (res) => {throw Error(res)});
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