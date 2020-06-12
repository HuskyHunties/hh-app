import React, { RefObject } from "react";
import ClueMap from "./clue-map";
import "../css/clue-frame.css";
import Popup from "../utils/popup";
import API from "../utils/API";
import Axios, { AxiosResponse } from "axios";

/**
 * Holds information about a clue
 */
export interface Clue {
  id: number;
  list: string;
  num: number;
  name: string;
  desc: string;
  place: google.maps.LatLngLiteral;
  finished: boolean;
}

/**
 * Sorts clues according first to their list, then their number.
 * @param clue1 comes first if < 0
 * @param clue2 comes first if > 0
 */
function clueCompare(clue1: Clue, clue2: Clue): number {
  if (clue1.list === clue2.list) {
    return clue1.num - clue2.num;
  } else {
    return clue1.list.localeCompare(clue2.list);
  }
}

/**
 * Properties type for the ClueList Component
 */
interface ClueListProps {
  clues: Clue[];
  select(selection: number): void;
  selected?: number | string;
}

/**
 * State type for the GroupList Component
 */
interface ClueListState {}

/**
 * A component that displays all of the currently created groups as a selectable list.
 */
class ClueList extends React.Component<ClueListProps, ClueListState> {
  /**
   * Renders the component
   */
  render() {
    const listItems = this.props.clues.sort(clueCompare).map((clue) => {
      return (
        <tr key={clue.id} onClick={() => this.props.select(clue.id)}>
          <td className={clue.id === this.props.selected ? "selected" : ""}>
            {clue.list + clue.num + ": " + clue.name}
          </td>
        </tr>
      );
    });

    //TODO make this much much better
    return (
      <table className="clue-table">
        <thead>
          <tr>
            <th>List of Clues</th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table>
    );
  }
}

/**
 * Properties type for the ClueFrame Component
 */
interface ClueFrameProps {}

/**
 * State type for the ClueFrame Component
 */
interface ClueFrameState {
  clues: Clue[];
  // Note: number selection values correspond to the selection of an existing clue.
  // Strings indicate the selection of a clue from search results
  selected?: number | string;
  clueLists: Set<string>;
}

/**
 * A class to represent a clue frame component.  This displays a list and map of clues,
 * and allows operations on those clues.
 */
export default class ClueFrame extends React.Component<ClueFrameProps, ClueFrameState> {
  intervalID?: NodeJS.Timeout;
  popupRef: RefObject<Popup>;

  constructor(props: ClueFrameProps) {
    super(props);
    this.state = {
      selected: undefined,
      clues: [],
      clueLists: new Set<string>(),
    };
    this.popupRef = React.createRef();
    this.updateClues = this.updateClues.bind(this);
  }

  /**
   * Gets the list of clues and starts refreshing the data.
   */
  componentDidMount() {
    this.updateClues();

    this.intervalID = setInterval(this.updateClues, 5000);
  }

  /**
   * Stops refreshing the clue data when the component is unloaded.
   */
  componentWillUnmount() {
    clearInterval(this.intervalID!);
  }

  /**
   * Updates the clues stored in state by making API calls
   */
  private updateClues() {
    const clues: Clue[] = [];
    let ids: number[] = [];
    const clueLists = new Set<string>();
    API.get("/clues/")
      .then((res) => {
        ids = res.data.clueIDs;
        return res.data.clueIDs.map((id: number) => {
          return API.get<AxiosResponse>("/clues/" + id, {});
        });
      })
      .then((routes) => Axios.all<AxiosResponse>(routes))
      .then((res: AxiosResponse[]) => {
        res.forEach((res: AxiosResponse, index: number) => {
          const clue = res.data;
          clues.push({
            list: (clue.listID as string).toUpperCase(),
            num: clue.clueNumber,
            name: clue.name,
            desc: clue.description,
            finished: clue.finished,
            place: { lng: clue.long, lat: clue.lat },
            id: ids[index],
          });
          clueLists.add((clue.listID as string).toUpperCase())
        });
      })
      .then(() => this.setState({ clues, clueLists }));
  }

  /**
   * Renders the ClueFrame.
   */
  render() {
    return (
      <div className={"clue-frame"}>
        <div className="clue-list">
          <ClueList
            selected={this.state.selected}
            select={(id: number) => this.setState({ selected: id })}
            clues={this.state.clues}
          />
        </div>
        <button className="clue-delete">Delete Clue</button>
        <div className="clue-map">
          <ClueMap
            clues={this.state.clues} selected={this.state.selected} clueLists={this.state.clueLists}
            select={(id: number) => this.setState({ selected: id })} popupRef={this.popupRef}
          />
        </div>
        <Popup ref={this.popupRef} />
      </div>
    );
  }
}
