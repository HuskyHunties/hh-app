import React from "react";
import "../css/main-page.css";

interface NavBarFrameProps {

}

interface NavBarFrameState {

}


export default class NavBarFrame extends React.Component<NavBarFrameProps, NavBarFrameState> {
    constructor(props: NavBarFrameProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="nav-bar">Navigation Bar</div>
            )
        }
}