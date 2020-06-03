import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MainPage from "./pages/main-page";

/**
 * Properties type for the PageLoader Component
 */
interface PageLoaderProps {

}

/**
 * State type for the PageLoader Component
 */
interface PageLoaderState {

}

/**
 * A wrapper component that handles displaying a page and the popup component.
 * Logic to control which page is displayed is handled in this component.
 */
class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {

  /**
   * Renders the component as a page and popup window contained in a div.
   */
  render() {
    return (<div>
      <MainPage />
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

