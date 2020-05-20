import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MainPage from "./pages/main-page";
import Popup, { PopupTypes } from "./popup/popup";

interface PageLoaderProps {

}

interface PageLoaderState {
  showPopup: boolean;
}

class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
  constructor(props: PageLoaderProps) {
    super(props);
    this.state = { showPopup: false };
  }

  render() {
    return (<div onDoubleClick={() => this.setState({showPopup: true})}>
      <MainPage />
      <Popup type={PopupTypes.Confirm} show={this.state.showPopup} hide={() => this.setState({showPopup: false})}/>
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


