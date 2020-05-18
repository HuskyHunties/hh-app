import React from "react";
import '../css/clue-frame.css';

interface ClueFrameProps {

}

interface ClueFrameState {

}


export default class ClueFrame extends React.Component<ClueFrameProps, ClueFrameState> {
    constructor(props: ClueFrameProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="clue-frame">Clue Frame</div>
            )
        }
}