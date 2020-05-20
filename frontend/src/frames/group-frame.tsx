import React from "react";
import '../css/group-frame.css';
import API from '../utils/API';

interface GroupListProps {
    ids: number[];
}

interface GroupListState {
}

class GroupList extends React.Component<GroupListProps, GroupListState> {

    render() {
        const groups = this.props.ids.map((id) => {
            const name = String(id); // Change to database logic
            const assocPath = "No Associated Path";
            return (
                <tr key={id}><td>{name}</td><td>{assocPath}</td></tr>
            );
        })
        return (
            <table><tbody>{groups}</tbody></table>
        );
    }
}

interface GroupFrameProps {

}

interface GroupFrameState {
    ids: number[];
}

export default class GroupFrame extends React.Component<GroupFrameProps, GroupFrameState> {
    constructor(props: GroupFrameProps) {
        super(props);
        this.state = {
            ids: []
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


    render() {
        return (
            <div className="group-frame">
                <GroupList ids={this.state.ids} />
                <button className="add-group">Add Group</button>
                <button className="remove-group">Remove Group</button>
            </div>
        )
    }
}