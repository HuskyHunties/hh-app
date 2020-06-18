import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import * as serviceWorker from "./serviceWorker";
import MainPage from "./main-page/main-page";
import { Clue } from "./main-page/clue-frame/clue-frame";
import API from "./utils/API";
import Axios, { AxiosResponse } from "axios";
import PathPage from "./path-page/path-page";

export enum PageTypes {
  MAINPAGE = 0,
  ROUTES = 1,
  IMAGES = 2
}

/**
 * Properties type for the PageLoader Component
 */
interface PageLoaderProps { }

/**
 * State type for the PageLoader Component
 */
interface PageLoaderState {
  currentPage: PageTypes;
  clues: Clue[];
  clueLists: Set<string>;
  currentPath?: number;
}

/**
 * A wrapper component that handles displaying a page and the popup component.
 * Logic to control which page is displayed is handled in this component.
 */
class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
  private intervalID?: NodeJS.Timeout;

  constructor(props: PageLoaderProps) {
    super(props);
    this.state = {
      currentPage: PageTypes.ROUTES,
      clues: [],
      clueLists: new Set<string>(),
      // REMOVE THIS, ONLY FOR TESTING
      currentPath: 1
    }
    this.updateClues = this.updateClues.bind(this);
    this.updatePage = this.updatePage.bind(this);
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

  private updatePage(type: PageTypes, routeID?: number) {
    if (type === PageTypes.ROUTES && !routeID) {
      throw new Error("Must supply route ID");
    }

    this.setState({
      currentPage: type,
      currentPath: routeID
    })
  }

  /**
   * Updates the clues stored in state by making API calls
   */
  private updateClues() {
    const clues: Clue[] = [];
    let ids: number[] = [];
    const clueLists = new Set<string>();
    API.get("/clues/").then((res) => {
      ids = res.data.clueIDs;
      return res.data.clueIDs.map((id: number) => {
        return API.get<AxiosResponse>("/clues/" + id, {});
      });
    }).then((routes) => Axios.all<AxiosResponse>(routes)).then((res: AxiosResponse[]) => {
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
    }).then(() => this.setState({ clues, clueLists }));
  }

  /**
   * Renders the component as a page and popup window contained in a div.
   */
  render() {
    let page: JSX.Element;
    switch (this.state.currentPage) {
      case PageTypes.MAINPAGE:
        page = <MainPage clues={this.state.clues} clueLists={this.state.clueLists}
          updateClues={this.updateClues} updatePage={this.updatePage} />;
        break;

      case PageTypes.ROUTES:
        page = <PathPage clues={this.state.clues} clueLists={this.state.clueLists}
        currentRoute={this.state.currentPath!} updatePage={this.updatePage} />
        break;

      case PageTypes.IMAGES:
        page = <div>Page not yet implemented</div>
        break;

      default:
        throw new Error("Invalid Page Type");
    }



    return page;
  }
}

/**
 * The main method to actually display content on the page.  This just displays the PageLoader Component.
 */
ReactDOM.render(
  <React.StrictMode>
    <PageLoader />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
