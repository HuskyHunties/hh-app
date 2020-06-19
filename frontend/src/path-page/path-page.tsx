import React from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";
import API from "../utils/API";
import PathInfo from "./path-info";
import PathMap from "./path-map";

interface PathPageProps {
    clues: Clue[];
    clueLists: Set<string>;
    currentRoute: number;
    updatePage(type: PageTypes): void;
}

interface PathPageState {
    routeName: string;
    routeClueIDs: number[];
    routeClues: Clue[];
}

export default class PathPage extends React.Component<PathPageProps, PathPageState> {
    constructor(props: PathPageProps) {
        super(props);
        this.state = {
            routeName: "",
            routeClueIDs: [],
            routeClues: [],
        }

        API.get("/paths/" + this.props.currentRoute, {}).then((res) => {
            this.setState({
                routeName: res.data.name,
                routeClueIDs: res.data.clueIDs
            })
        })
    }

    /**
     * Updates the list of clues in the state when clues or the route's list of clue ids changes
     * @param prev the previous property values
     */
    componentDidUpdate(prevProps: PathPageProps, prevState: PathPageState) {
        if (prevProps.clues !== this.props.clues || prevState.routeClueIDs !== this.state.routeClueIDs) {
            this.setState({
                routeClues: this.props.clues.filter((clue) => this.state.routeClueIDs.includes(clue.id))
            })
        }
    }


    render() {
        return (
            <div className="path-page-container" >
                <PathInfo routeName={this.state.routeName} routeClues={this.state.routeClues} updatePage={this.props.updatePage} />
                <PathMap clues={this.props.clues} clueLists={this.props.clueLists} routeClues={this.state.routeClues} />
            </div>
        )
    }
}