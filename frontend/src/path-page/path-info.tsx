import React from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";

interface PathInfoProps {
    pathName: string;
    pathClues: Clue[];
    updatePage(type: PageTypes): void;
    selected?: number;
    select(id: number): void;
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
        return (
            <div className="path-info-container" >
                <PathList pathName={this.props.pathName} pathClues={this.props.pathClues} selected={this.props.selected}
                    select={this.props.select} />
                    {/** TODO: Actually handle exiting */}
                <button className="exit" onClick={() => this.props.updatePage(PageTypes.MAINPAGE)}>Done Modifying</button>
            </div>
        )
    }
}


interface PathListProps {
    pathName: string;
    pathClues: Clue[];
    selected?: number;
    select(id: number): void;
}

interface PathListState {
}

class PathList extends React.Component<PathListProps, PathListState> {

    render() {
        const clues = this.props.pathClues.map((clue) => {
            return <tr key={clue.id} onClick={() => this.props.select(clue.id)}>
                <td className={clue.id === this.props.selected ? "selected" : ""}>
                    {clue.list + clue.num + ": " + clue.name}
                </td>
            </tr>
        })


        return (
            <table>
                <thead>
                    <tr>
                        <th>Path Clues</th>
                    </tr>
                </thead>
                <tbody>
                    {clues}
                </tbody>
            </table>
        )
    }

}