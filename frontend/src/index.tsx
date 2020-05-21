import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MainPage from "./pages/main-page";
import Popup, { PopupTypes } from "./popup/popup";

interface PageLoaderProps {

}

interface PageLoaderState {
  // Popup information
  showPopup: boolean;
  popupType: PopupTypes;
  popupMessage: String;
  popupDoInput?(res: String): void;
  popupDoConfirm?(): void;
}

class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
  constructor(props: PageLoaderProps) {
    super(props);
    this.state = { showPopup: false, popupType: PopupTypes.Confirm, popupMessage: "Message Not Intialized" };
  }

  private hidePopup() {
    this.setState({ showPopup: false })
  }

  private popupFactory(type: PopupTypes, message: String, onInput?: (res: String) => void, onConfirm?: () => void) {
    this.setState({showPopup: true, popupType: type, popupMessage: message, popupDoInput: onInput, popupDoConfirm: onConfirm})
}

  render() {
    return (<div onDoubleClick={() => this.popupFactory(PopupTypes.Confirm, "It works!", undefined, () => this.hidePopup())}>
      <MainPage />
      <Popup showPopup={this.state.showPopup} popupType={this.state.popupType} popupMessage={this.state.popupMessage}
        popupDoInput={this.state.popupDoInput} popupDoConfirm={this.state.popupDoConfirm} hidePopup={() => this.hidePopup()} />
    </div>);
  }

}

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


