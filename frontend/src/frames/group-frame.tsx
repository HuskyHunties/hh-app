import React from "react";
import '../css/group-frame.css';
import API from '../utils/API';
import { PopupTypes, PopupCreator } from '../utils/popup'

interface GroupListProps {
    ids: number[];
    clickHandler(selection: number): void;
    selected: number | undefined;
}

class GroupList extends React.Component<GroupListProps> {

    render() {
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
                <table>
                    <thead><tr><th>List of Groups</th></tr></thead>
                    <tbody>{groups}</tbody>
                </table>
            </div>
        );
    }
}

interface GroupFrameProps {
    popupFactory: PopupCreator;
}

interface GroupFrameState {
    ids: number[];
    selected: number | undefined;
}

export default class GroupFrame extends React.Component<GroupFrameProps, GroupFrameState> {
    constructor(props: GroupFrameProps) {
        super(props);
        this.state = {
            ids: [],
            selected: undefined
        }
    }

    componentDidMount() {
        this.setIDs();
    }

    /**
     * Sets the state to a list of group ids, fetched from the backend.
     */
    async setIDs() {
        // Implement backend call
        const ids = (await API.get("/groups", {})).data;
        this.setState(ids);
    }

    async addGroup(name: string) {
        // Implement
        console.log("added Group: " + name);
    }

    async deleteGroup(id: number) {
        // Implement
        console.log("deleted group: " + id);
    }


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