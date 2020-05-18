import React from "react";
import "../css/main-page.css";

interface NavBarFrameProps {

}

interface NavBarFrameState {

}

function switchTheme(checked: boolean) {
    if (checked) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}


export default class NavBarFrame extends React.Component<NavBarFrameProps, NavBarFrameState> {
    constructor(props: NavBarFrameProps) {
        super(props);
        // TODO set up state
    }


    render() {
        return (
            <div className="nav-bar">
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Navigation Bar</a>
                <div className="theme-switch-wrapper">
                    <label className="theme-switch" htmlFor="checkbox" >
                        <input type="checkbox" id="checkbox"
                            onClick={(event: React.MouseEvent) => switchTheme((event.target as HTMLInputElement).checked)} />
                        <div className="slider round"></div>
                    </label>
                    <em>Enable Light Mode!</em>
                </div>
            </div>
        )
    }
}