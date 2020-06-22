import React, { RefObject } from "react";
import "./path-page.css";
import { Clue } from "../main-page/clue-frame/clue-frame";
import { PageTypes } from "..";
import API from "../utils/API";
import Popup, { PopupTypes } from "../utils/popup";

/**
 * Props type for the Path Info component.
 */
interface PathInfoProps {
    pathName: string;
    pathClues: Clue[];
    updatePage(type: PageTypes): void;
    selected?: number;
    select(id?: number): void;
    currentPath: number;
    updateInfo(): void;
    popupRef: RefObject<Popup>;
    removeClue(): void;
}

/**
 * State type for the Path Info component.
 */
interface PathInfoState {
}

/**
 * A component to display the list of clues and buttons to manipulate that list.
 */
export default class PathInfo extends React.Component<PathInfoProps, PathInfoState> {
    constructor(props: PathInfoProps) {
        super(props);
        this.state = {
        }
    }

    /**
     * Handle exiting the page and returning to the main page.
     */
    handleExit() {
        const clueIDs = this.props.pathClues.map((clue) => clue.id);
        API.put("paths/" + this.props.currentPath + "/order", { clueIDs })
            .then(() => this.props.updatePage(PageTypes.MAINPAGE), () => {
                this.props.popupRef.current?.popupFactory(PopupTypes.Confirm, "Order may not be preserved. Exit anyway?")
                    .then(() => this.props.updatePage(PageTypes.MAINPAGE));
            });
    }

    /**
     * Render the component.
     */
    render() {
        return (
            <div className="path-info-container" >
                <PathList pathName={this.props.pathName} pathClues={this.props.pathClues} selected={this.props.selected}
                    select={this.props.select} updateInfo={this.props.updateInfo} currentPath={this.props.currentPath}
                    popupRef={this.props.popupRef} />
                <button className="remove-clue" onClick={this.props.removeClue}>Remove Selected Clue</button>
                <button className="exit" onClick={() => this.handleExit()}>Done Modifying</button>
            </div>
        )
    }
}

/**
 * Props types for the Path List component.
 */
interface PathListProps {
    pathName: string;
    pathClues: Clue[];
    selected?: number;
    select(id: number): void;
    currentPath: number;
    updateInfo(): void;
    popupRef: RefObject<Popup>;
}

/**
 * State type for the Path List component.
 */
interface PathListState {
    dragIndex?: number;
    overIndex?: number;
}

/**
 * A component to display the list of clues in the path
 */
class PathList extends React.Component<PathListProps, PathListState> {
    constructor(props: PathListProps) {
        super(props);
        this.state = {
        }
    }

    /**
     * Handles when a clue in the list starts to be dragged
     * @param e the drag event
     * @param clue the clue being dragged
     * @param idx the index of the original position
     */
    private startDrag(e: React.DragEvent<HTMLTableRowElement>, clue: Clue, idx: number) {
        // TODO deal with mouse icons
        const element = document.createElement("div");
        element.style.opacity = "0";
        e.dataTransfer.setDragImage(element, 0, 0);
        e.dataTransfer.dropEffect = "none";
        this.setState({ dragIndex: idx, overIndex: idx })
    }

    /**
     * Handles when a clue in the list is dropped in its new position, updating the path order in the backend.
     */
    private dragEnd() {
        const clueIDs = this.props.pathClues.map((clue) => clue.id);
        const dragClue = clueIDs.splice(this.state.dragIndex!, 1);
        clueIDs.splice(this.state.overIndex! < this.state.dragIndex! ? this.state.overIndex! + 1 : this.state.overIndex!, 0, dragClue[0]);
        API.put("paths/" + this.props.currentPath + "/order", { clueIDs }).then(this.props.updateInfo, () => {
            this.props.popupRef.current?.popupFactory(PopupTypes.Notif, "Reorder Failed, Please Try Again");
            this.props.updateInfo();
        }).then(() => this.setState({ dragIndex: undefined, overIndex: undefined }))
    }

    /**
     * Render the component.
     */
    render() {
        const clues = this.props.pathClues.map((clue, idx) => {
            return <tr key={clue.id} onClick={() => this.props.select(clue.id)} draggable
                onDragStart={(e) => this.startDrag(e, clue, idx)} onDragEnd={() => this.dragEnd()}
                onDragEnter={() => {
                    if (idx !== this.state.dragIndex) {
                        this.setState({ overIndex: idx })
                    }
                }}>
                <td className={clue.id === this.props.selected ? "selected" : ""}>
                    {clue.list + clue.num + ": " + clue.name}
                </td>
            </tr>
        })

        if (this.state.dragIndex || this.state.dragIndex === 0) {
            const dragClue = clues.splice(this.state.dragIndex, 1);
            clues.splice(this.state.overIndex! < this.state.dragIndex ? this.state.overIndex! + 1 : this.state.overIndex!, 0, dragClue[0])
        }


        return (
            <table>
                <thead onDragEnter={() => this.setState({ overIndex: -1 })}>
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