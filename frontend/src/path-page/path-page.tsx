import React from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";
import API from "../utils/API";

interface PathPageProps {
    clues: Clue[];
    clueLists: Set<string>;
    currentRoute: number;
    updatePage(type: PageTypes): void;
}

interface PathPageState {
    routeName: string;
    routeClues: number[];
}

export default class PathPage extends React.Component<PathPageProps, PathPageState> {
    constructor(props: PathPageProps) {
        super(props);
        this.state = {
            routeName: "",
            routeClues: [],
        }

        API.get("/paths/" + this.props.currentRoute, {}).then((res) => {
            this.setState({
                routeName: res.data.name,
                routeClues: res.data.clueIDs
            })
        })
    }


    render() {
        return (
            <div className="path-page-container" >
                Name: {this.state.routeName} <br></br><br />
                Clues: {this.state.routeClues}
            </div>
        )
    }
}