import React from "react";
import "../css/nav-bar.css";
import { PageTypes } from "..";

/**
 * Properties type for the NavBarFrame Component
 */
interface NavBarFrameProps {
  updatePage(type: PageTypes, routeID?: number): void;
}

/**
 * State type for the NavBarFrame Component
 */
interface NavBarFrameState {}

/**
 * Switches the site between light and dark theme.
 * @param dark is the theme currently dark.
 */
function switchTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

/**
 * Class to represent the Navigation Bar Component
 */
export default class NavBarFrame extends React.Component<NavBarFrameProps,NavBarFrameState> {
  /**
   * Renders the component.
   */
  render() {
    return (
      <div className="nav-bar">
        <div onClick={() => this.props.updatePage(PageTypes.SETTINGS)} className={"settings"}>Settings</div>
        {/* Theme Toggle Swtich */}
        <div className="theme-switch-wrapper">
          <label className="theme-switch" htmlFor="checkbox">
            <input
              type="checkbox"
              id="checkbox"
              onClick={(event: React.MouseEvent) =>
                switchTheme((event.target as HTMLInputElement).checked)
              }
            />
            <div className="slider round"></div>
          </label>
          <em>Enable Light Mode!</em>
        </div>
      </div>
    );
  }
}
