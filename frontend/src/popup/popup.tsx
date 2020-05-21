import React from 'react';
import './popup.css';

export enum PopupTypes {
    Confirm = "confirm",
    Input = "input",
    Notif = "notif"
}

export type PopupCreator = (type: PopupTypes, message: String, onInput: (res: String) => void, onConfirm: () => void) => void;

interface PopupProps {
    showPopup: boolean;
    popupType: PopupTypes;
    popupMessage: String;
    popupDoInput?(res: String): void;
    popupDoConfirm?(): void;
    hidePopup(): void;
}

interface PopupState {
    inputValue: string;
}

export default class Popup extends React.Component<PopupProps, PopupState> {
    constructor(props: PopupProps) {
        super(props);
        this.state = { inputValue: "" };
    }

    private handleClick() {
        if (this.props.popupType === PopupTypes.Confirm) {
            (this.props.popupDoConfirm)!();
        } else if (this.props.popupType === PopupTypes.Input) {
            (this.props.popupDoInput)!("Fill this in");
        }

        this.props.hidePopup();
    }

    private confirm(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="okay">Okay</button>
                <button className="cancel">Cancel</button>
            </div>);
    }

    private input(): JSX.Element {
        return (
            <div className="popup-button">
                <input type="text" id="input" value={this.state.inputValue}
                    onChange={(e) => this.setState({ inputValue: e.target.value })}></input>
                <button className="okay">Okay</button>
                <button className="cancel">Cancel</button>
            </div>
        );
    }

    private notif(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="notif">Okay</button>
            </div>
        );
    }

    render() {
        let buttons: JSX.Element;
        switch (this.props.popupType) {
            case PopupTypes.Confirm:
                buttons = this.confirm();
                break;

            case PopupTypes.Input:
                buttons = this.input();
                break;

            case PopupTypes.Notif:
                buttons = this.notif();
                break;

            default:
                throw Error("Invalid Type")
        }

        return (
            <div className={this.props.showPopup ? "popup" : "hidden"}>
                <div className="popup-text">
                    {this.props.popupMessage}
                </div>

                {buttons}
            </div>
        );
    }
}