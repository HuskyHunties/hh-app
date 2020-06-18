import React from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";

interface PathInfoProps {
    routeName: string;
    routeClues: Clue[];
    updatePage(type: PageTypes): void;
}

interface PathInfoState {
}

export default class PathInfo extends React.Component<PathInfoProps, PathInfoState> {
    constructor(props: PathInfoProps) {
        super(props);
        this.state = {
        }
    }


    render() {
        console.log(this.props.routeClues);
        return (
            <div className="path-info-container" >
                <PathList routeName={this.props.routeName} routeClues={this.props.routeClues} />
                <button className="confirm-path">Save Path</button>
                <button className="discard-path" onClick={() => this.props.updatePage(PageTypes.MAINPAGE)}>Discard Changes</button>
            </div>
        )
    }
}


interface PathListProps {
    routeName: string;
    routeClues: Clue[];
}

interface PathListState {
}

class PathList extends React.Component<PathListProps, PathListState> {

    render() {
        return (
            <div>
                <h1>{this.props.routeName}</h1>
            </div>
        )
    }

}