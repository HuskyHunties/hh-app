import React from "react";
import ClueFrame from "../frames/clue-frame";
import "../css/main-page.css";

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
                <ClueFrame />
            </div>
            )
        }
}