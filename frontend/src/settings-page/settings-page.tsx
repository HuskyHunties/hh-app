import React from "react";
import { Settings } from "backend/routes/settingsRouter"
import { PageTypes } from "..";
import "./settings-page.css";

interface SettingsPageProps {
    updatePage(type: PageTypes, routeID?: number): void;
    settings?: Settings;
}

interface SettingsPageState {
    
}

export default class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {

    

// TODO actually save changes
    render() {
        const crawls = this.props.settings?.crawls.map((crawl) => {
            return <div>{crawl + " -- " + this.props.settings?.colors.get(crawl)}</div>
            })

        return (
            <div>
                {crawls}
                <button  className="save-changes" onClick={() => this.props.updatePage(PageTypes.MAINPAGE)}>
                    Save Settings
                </button>
            </div>
        )
    }
}