import React from 'react';
import './popup.css';

export enum PopupTypes {
    Confirm = "confirm",
    Input = "input",
    Notif = "notif"
}

export type PopupCreator = (type: PopupTypes, message: string, onInput?: (res: string) => void, onConfirm?: () => void) => void;

interface PopupProps {
    showPopup: boolean;
    popupType: PopupTypes;
    popupMessage: string;
    popupDoInput?(res: string): void;
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

    private handleClick(confirm: boolean, input: boolean, inputValue?: string) {
        if (confirm) {
            (this.props.popupDoConfirm)!();
        } else if (input) {
            (this.props.popupDoInput)!(inputValue!);
        }

        this.setState({inputValue: ""});
        this.props.hidePopup();
    }

    private confirm(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="okay" onClick={() => this.handleClick(true, false)}>Okay</button>
                <button className="cancel" onClick={() => this.handleClick(false, false)}>Cancel</button>
            </div>);
    }

    private input(): JSX.Element {
        return (
            <div className="popup-button">
                <input type="text" id="input" value={this.state.inputValue}
                    onChange={(e) => this.setState({ inputValue: e.target.value })}></input>
                <button className="okay" onClick={() => this.handleClick(false, true, this.state.inputValue)}>Okay</button>
                <button className="cancel" onClick={() => this.handleClick(false, false)}>Cancel</button>
            </div>
        );
    }

    private notif(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="notif" onClick={() => this.handleClick(false, false)}>Okay</button>
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