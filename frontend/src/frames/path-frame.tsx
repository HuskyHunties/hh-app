import React from "react";
import '../css/path-frame.css';

interface PathFrameProps {

}

interface PathFrameState {

}


export default class PathFrame extends React.Component<PathFrameProps, PathFrameState> {
    constructor(props: PathFrameProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="path-frame">Path Frame</div>
            )
        }
}