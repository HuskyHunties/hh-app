import React from "react";
import ClueFrame from "../frames/clue-frame";
import "../css/main-page.css";
import "../css/nav-bar.css"
import NavBarFrame from "../utils/nav-bar";
import PathFrame from "../frames/path-frame";
import GroupFrame from "../frames/group-frame";
import { PopupCreator } from "../utils/popup";

/**
 * Properties type for the MainPage Component.
 */
interface MainPageProps {
    popupFactory: PopupCreator;
}

/**
 * State type for the MainPage Component.
 */
interface MainPageState {

}

/**
 * A component that will serve as the main page of the application.  This page will contain clue, path, 
 * and group information and allow for modification of those categories.
 */
export default class MainPage extends React.Component<MainPageProps, MainPageState> {
    render() {
        return (
            <div className="main-page">
                <NavBarFrame />
                <ClueFrame />
                <PathFrame />
                <GroupFrame popupFactory={this.props.popupFactory} />
            </div>
        )
    }
}