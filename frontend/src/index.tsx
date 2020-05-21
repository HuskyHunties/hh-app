import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MainPage from "./pages/main-page";
import Popup, { PopupTypes } from "./utils/popup";

/**
 * Properties type for the PageLoader Component
 */
interface PageLoaderProps {

}

/**
 * State type for the PageLoader Component
 */
interface PageLoaderState {
  // Popup information
  showPopup: boolean;
  popupType: PopupTypes;
  popupMessage: string;
  popupDoInput?(res: string): void;
  popupDoConfirm?(): void;
}

/**
 * A wrapper component that handles displaying a page and the popup component.
 * Logic to control which page is displayed is handled in this component.
 */
class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
  constructor(props: PageLoaderProps) {
    super(props);
    this.state = { showPopup: false, popupType: PopupTypes.Confirm, popupMessage: "Message Not Intialized" };
    this.popupFactory = this.popupFactory.bind(this);
  }

  /**
   * Hides the popup window
   */
  private hidePopup() {
    this.setState({ showPopup: false })
  }

  /**
   * Creates a pop up window.
   * @param type - the type of popup
   * @param message - the message to be displayed in the popup
   * @param onInput - the function to be executed when a user inputs a value to the popup
   * @param onConfirm - the function to be executed when a user confirms the question asked by the popup
   */
  private popupFactory(type: PopupTypes, message: string, onInput?: (res: string) => void, onConfirm?: () => void) {
    this.setState({showPopup: true, popupType: type, popupMessage: message, popupDoInput: onInput, popupDoConfirm: onConfirm})
}

  /**
   * Renders the component as a page and popup window contained in a div.
   */
  render() {
    return (<div>
      <MainPage popupFactory={this.popupFactory} />
      <Popup showPopup={this.state.showPopup} popupType={this.state.popupType} popupMessage={this.state.popupMessage}
        popupDoInput={this.state.popupDoInput} popupDoConfirm={this.state.popupDoConfirm} hidePopup={() => this.hidePopup()} />
    </div>);
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


