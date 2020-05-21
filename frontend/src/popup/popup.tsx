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
    render() {

        return (
            <div className={this.props.showPopup ? "popup" : "hidden"}
                onClick={() => this.handleClick()}>
                {this.props.popupMessage}
            </div>
        );
    }
}