import React from "react";
import ClueMap from "./maps";
import '../css/clue-frame.css';
import Popup from "../utils/popup";

/**
 * Holds a lat and a lng
 */
export interface Place {
    lat: number;
    lng: number;
}

/**
 * Holds information about a clue
 */
export interface Clue {
    list: string;
    num: number;
    name: string;
    desc: string;
    place: Place;
    finished: boolean;
}

/**
 * Properties type for the ClueList Component
 */
interface ClueListProps {
    clues: Map<number, Clue>;
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
        const listItems = Array.from(this.props.clues, ([id, clue]) => {
            return (
                <tr key={id}><td>{clue.list + clue.num}</td><td>{clue.name}</td></tr>
            )
        })


        //TODO this
        return (
            <table className="group-table">
                <thead><tr><th>List of Clues</th></tr></thead>
                <tbody>{listItems}</tbody>
            </table>
        );
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
        this.state = {
            selected: undefined
        };
        this.popupRef = React.createRef();
    }

    /**
     * Renders the ClueFrame.
     */
    render() {
        return (
            <div className={"clue-frame"}>
                <div className="clue-list">
                    <ClueList selected={this.state.selected} clickHandler={(id: number) => this.setState({ selected: id })}
                    clues={new Map()} />
                </div>
                <div className="clue-map">
                    <ClueMap />
                </div>
                <Popup ref={this.popupRef} />
            </div>

        )
    }
}
