import React from "react";
import '../css/path-frame.css';

/**
 * Properties type for the PathFrame Component
 */
interface PathFrameProps {

}

/**
 * State type for the PathFrame Component
 */
interface PathFrameState {

}

/**
 * A component to display a list of paths and allow operations on those paths.
 */
export default class PathFrame extends React.Component<PathFrameProps, PathFrameState> {
    /**
     * Renders the component.
     */
    render() {
        return (
            <div className="path-frame">Path Frame</div>
            )
        }
}