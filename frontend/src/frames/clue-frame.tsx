import React from "react";
import ClueMap, { SearchPanel } from "./maps";
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
    select(selection: number): void;
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
                <tr key={id} onClick={() => this.props.select(id)}>
                    <td className={id === this.props.selected ? "selected" : ""}>
                        {clue.list + clue.num + ": " + clue.name}
                    </td>
                </tr>
            )
        })


        //TODO this
        return (
            <table className="clue-table">
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
    clues: Map<number, Clue>;
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
        const clues = new Map<number, Clue>();
        clues.set(1, { name: "Amelia's", list: "A", num: 69, finished: false, desc: "", place: { lat: 42.34117, lng: -71.0874334 } });
        clues.set(2, { name: "Speare Hall", list: "B", num: 420, finished: false, desc: "In front of res-mail", place: { lat: 42.3406995, lng: -71.0897018 } });
        clues.set(3, { name: "Castle Island", list: "C", num: 3, finished: false, desc: "", place: { lat: 42.3378643, lng: -71.0125351 } });
        this.state = {
            selected: undefined,
            clues
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
                    <ClueList selected={this.state.selected} select={(id: number) => this.setState({ selected: id })}
                        clues={this.state.clues} />
                </div>
                <div className="clue-map">
                    <ClueMap clues={this.state.clues} selected={this.state.selected} select={(id: number) => this.setState({selected: id})} />
                </div>
                <Popup ref={this.popupRef} />
            </div>

        )
    }
}
