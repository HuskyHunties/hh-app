import React from "react";
import '../css/clue-frame.css';

/**
 * Properties type for the ClueFrame Component
 */
interface ClueFrameProps {

}

/**
 * State type for the ClueFrame Component
 */
interface ClueFrameState {

}

/**
 * A class to represent a clue frame component.  This displays a list and map of clues, 
 * and allows operations on those clues.
 */
export default class ClueFrame extends React.Component<ClueFrameProps, ClueFrameState> {

    /**
     * Renders the ClueFrame.
     */
    render() {
        return (
            <div className="clue-frame">Clue Frame</div>
        )
    }
}