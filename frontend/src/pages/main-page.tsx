import React from "react";
import ClueFrame from "../frames/clue-frame";
import "../css/main-page.css";
import "../css/nav-bar.css"
import NavBarFrame from "../utils/nav-bar";
import PathFrame from "../frames/path-frame";
import GroupFrame, { Group } from "../frames/group-frame";
import API from "../utils/API";

/**
 * Properties type for the MainPage Component.
 */
interface MainPageProps {
}

/**
 * State type for the MainPage Component.
 */
interface MainPageState {
    groups: Map<number, Group>;
    paths: Map<number, string>;
}

/**
 * A component that will serve as the main page of the application.  This page will contain clue, path, 
 * and group information and allow for modification of those categories.
 */
export default class MainPage extends React.Component<MainPageProps, MainPageState> {
    private intervalID?: NodeJS.Timeout;
    constructor(props: MainPageProps) {
        super(props);
        this.state = {groups: new Map(), paths: new Map()};
        this.updateInfo = this.updateInfo.bind(this);
    }

    /**
     * Get the list of path ids from the database if the component will be loaded.
     */
    componentDidMount() {
        this.updateInfo();
        const map = new Map<number, string>();
        map.set(1, "one");
        map.set(2, "two");
        console.log(map);

        //this.intervalID = setInterval(this.updateInfo, 5000);
    }

    /**
     * Stop refreshing the data when the component is unloaded.
     */
    componentWillUnmount() {
        clearInterval(this.intervalID!);
    }


    /**
     * Update the state by making api calls
     */
    private updateInfo() {
        const paths = new Map();
        const groups = new Map();

        // Group API calls
        API.get("groups", {}).then((res) => res.data.allGroups.forEach((groupID: number) => {
            API.get("groups/" + groupID, {}).then((res) => groups.set(groupID, {name: res.data.name, pathID: res.data.pathID}));
        })).then(() => this.setState({groups: groups}));


        // Path API calls
        API.get("paths", {}).then((res) => res.data.allPaths.forEach((pathID: number) => {
            API.get("paths/" + pathID, {}).then((res) => paths.set(pathID, res.data.name));
        })).then(() => this.setState({paths: paths})).then( () => console.log(this.state.paths));
    }
    
    render() {
        return (
            <div className="main-page">
                <NavBarFrame />
                <ClueFrame />
                <PathFrame paths={this.state.paths} updateInfo={this.updateInfo}/>
                <GroupFrame groups={this.state.groups} paths={this.state.paths} updateInfo={this.updateInfo} />
            </div>
        )
    }
}