import React from 'react';
import './popup.css';

export enum PopupTypes {
    Confirm = "confirm",
    Input = "input",
    Notif = "notif",
    NotifAck = "notifAck"
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
}

export default class Popup extends React.Component<PopupProps, PopupState> {
    private handleClick() {
        if (this.props.popupType === PopupTypes.Confirm) {
            (this.props.popupDoConfirm)!();
        } else if (this.props.popupType === PopupTypes.Input) {
            (this.props.popupDoInput)!("Fill this in");
        }

        this.props.hidePopup();
    }

    private confirm(): JSX.Element {
        return <div></div>;
    }

    private input(): JSX.Element {
        return <div></div>
    }

    private notif(): JSX.Element {
        return <div></div>
    }

    private notifAck(): JSX.Element {
        return <div></div>
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

            case PopupTypes.NotifAck:
                buttons = this.notifAck();
                break;

            default:
                throw Error("Invalid Type")
        }

        return (
            <div className={this.props.showPopup ? "popup" : "hidden"}>
                {this.props.popupMessage}

            </div>
        );
    }
}