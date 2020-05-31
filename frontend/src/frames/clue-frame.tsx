import React from "react";
import ClueMap from "./maps";
import '../css/clue-frame.css';
import Popup from "../utils/popup";

/**
 * Holds a name and pathID of a group
 */
export interface Clue {
    // TODO Implement
}

/**
 * Properties type for the ClueList Component
 */
interface ClueListProps {
    // TODO clues
    clickHandler(selection: number): void;
    selected?: number;
}

/**
* State type for the GroupList Component
*/
interface ClueListState {
}

/**
 * A component that displays all of the currently created groups as a selectable list.
 */
class ClueList extends React.Component<ClueListProps, ClueListState> {
    /**
     * Renders the component
     */
    render() {
        //TODO this
        return <div></div>;
    }
}


/**
 * Properties type for the ClueFrame Component
 */
interface ClueFrameProps {

}

/**
 * State type for the ClueFrame Component
 */
interface ClueFrameState {
    selected?: number;
}

/**
 * A class to represent a clue frame component.  This displays a list and map of clues, 
 * and allows operations on those clues.
 */
export default class ClueFrame extends React.Component<ClueFrameProps, ClueFrameState> {
    popupRef: React.Ref<Popup>;

    constructor(props: ClueFrameProps) {
        super(props);
        this.setState({
            selected: undefined
        })
        this.popupRef = React.createRef();
    }

    /**
     * Renders the ClueFrame.
     */
    render() {
        return (
            <div className={"clue-frame"}>
                <div className="clue-list">
                    <ClueList selected={this.state.selected} clickHandler={(id: number) => this.setState({selected: id})} />
                </div>
                <div className="clue-map">
                    <ClueMap />
                </div>
                <Popup ref={this.popupRef} />
            </div>

        )
    }
}
