import React from "react";
import '../css/group-frame.css';

interface GroupFrameProps {

}

interface GroupFrameState {

}


export default class GroupFrame extends React.Component<GroupFrameProps, GroupFrameState> {
    constructor(props: GroupFrameProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="group-frame">Group Frame</div>
            )
        }
}