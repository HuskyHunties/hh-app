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
            <div className="nav-bar"><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Navigation Bar</a></div>
            )
        }
}