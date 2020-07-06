import React, { RefObject } from "react";
import { Settings } from "backend/routes/settingsRouter"
import { PageTypes } from "..";
import urlMap, { Icons } from "../utils/icons";
import "./settings-page.css";
import Popup, { PopupTypes } from "../utils/popup";
import API from "../utils/API";

interface SettingsPageProps {
    updatePage(type: PageTypes, routeID?: number): void;
    settings?: Settings;
    cluesLists?: Set<string>;
    updateInfo(): void;
}

interface SettingsPageState {
    newColors?: Map<string, Icons>;
}

export default class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {
    popupRef: RefObject<Popup>;

    constructor(props: SettingsPageProps) {
        super(props);
        this.state = { newColors: this.props.settings?.colors };
        this.addCrawl = this.addCrawl.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.popupRef = React.createRef();
    }

    /**
     * Adds a crawl to the list of crawls in settings.
     */
    addCrawl() {
        const nonCrawls = this.props.cluesLists;
        this.props.settings?.crawls.forEach((crawl) => nonCrawls?.delete(crawl));
        const listMap = new Map<number, string>();
        Array.from(nonCrawls!).forEach((list, idx) => listMap.set(idx, list));
        this.popupRef.current?.popupFactory(PopupTypes.DropDown, "Which list should be added?", listMap)
            .then((num) => {
                if (num) {
                    const newCrawl = listMap.get(Number(num));
                    API.post("/settings/crawl", { newCrawl }).then(this.props.updateInfo, (res) => this.handleAddError(res.response.status));
                }
            }, this.props.updateInfo);
    }

    /**
     * Handles API errors from an add request.
     * @param code the error code
     */
    handleAddError(code: number) {
        if (code === 401) {
            this.props.updateInfo();
        } else {
            console.log(code);
            throw new Error("Unknown Error Code");
        }
    }

    /**
     * Deletes a crawl from the list of crawls in settings
     * @param crawl the name of the crawl to be deleted
     */
    deleteCrawl(crawl: string) {
        this.popupRef.current?.popupFactory(PopupTypes.Confirm, "Remove crawl " + crawl + "?")
            .then((num) => {
                API.delete("/settings/crawl/" + { crawl }).then(this.props.updateInfo, (res) => this.handleDeleteError(res.response.status));
            }, this.props.updateInfo);
    }

    /**
     * Handles API errors from a delete request
     * @param code the error code
     */
    handleDeleteError(code: number) {
        if (code === 401) {
            this.props.updateInfo();
        } else {
            console.log(code);
            throw new Error("Unknown Error Code");
        }
    }

    /**
     * Saves the color changes in settings
     */
    saveChanges() {
        const colors = new Map<string, Icons>();
        this.state.newColors!.forEach((color, crawl) => {
            if (this.props.settings?.colors.get(crawl) !== color) {
                colors.set(crawl, color);
            }
        })

        console.log(colors);
        API.put("/settings/crawl/colors", { colors: Array.from(colors) }).then(() => this.props.updatePage(PageTypes.MAINPAGE),
            (res) => this.handleSaveError(res.response.status));
    }

    /**
     * Handles API errors from a save changes request
     * @param code the error code
     */
    handleSaveError(code: number) {
        if (code === -1) {
            this.props.updateInfo();
        } else {
            console.log(code);
            throw new Error("Unknown Error Code");
        }
    }

    render() {
        const options = Array.from(urlMap.keys()).map((icon) => {
            return <option value={icon} key={icon}>{icon}</option>
        })


        const changeColor = (e: React.ChangeEvent<HTMLSelectElement>, crawl: string) => {
            const newMap = this.state.newColors;
            newMap?.set(crawl, e.target.value as Icons);
            this.setState({newColors: newMap});
        }
        const crawls = this.props.settings?.crawls.map((crawl) => {
            return <div key={crawl} className={"crawl-div"}>
                {crawl + ": "}
                <select value={this.state.newColors?.get(crawl)} onChange={(e) => changeColor(e, crawl)}>
                    {options}
                </select>
                <button onClick={() => this.deleteCrawl(crawl)}>Remove</button>
            </div>
        })

        return (
            <div>
                {crawls}
                <button className="add-crawl" onClick={this.addCrawl}>Add Crawl</button>
                <button className="save-changes" onClick={this.saveChanges}>
                    Save Settings
                </button>
                <Popup ref={this.popupRef} />
            </div>
        )
    }
}