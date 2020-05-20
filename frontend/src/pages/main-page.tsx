import React from "react";
import ClueFrame from "../frames/clue-frame";
import "../css/main-page.css";
import "../css/nav-bar.css"
import NavBarFrame from "../frames/nav-bar";
import PathFrame from "../frames/path-frame";
import GroupFrame from "../frames/group-frame";

interface MainPageProps {

}

interface MainPageState {

}


export default class MainPage extends React.Component<MainPageProps, MainPageState> {
    render() {
        return (
            <div className="main-page">
                <NavBarFrame />
                <ClueFrame />
                <PathFrame />
                <GroupFrame />
            </div>
            )
        }
}