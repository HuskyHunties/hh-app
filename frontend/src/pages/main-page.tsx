import React from "react";
import ClueFrame from "../frames/clue-frame";
import "../css/main-page.css";
import NavBarFrame from "../frames/nav-bar";

interface MainPageProps {

}

interface MainPageState {

}


export default class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="main-page">
                <NavBarFrame />
                <ClueFrame />
            </div>
            )
        }
}