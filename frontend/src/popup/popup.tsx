import React from 'react';
import './popup.css';

export enum PopupTypes {
    Confirm = "confirm",
    Input = "input",
    Notif = "notif",
    NotifAck = "notifAck"
}

interface PopupProps {
    type: PopupTypes;
    show: boolean;
    hide(): void;
}

interface PopupState {
    res: boolean | string | null;
}

export default class Popup extends React.Component<PopupProps, PopupState> {

    render() {
        return (
            <div className={this.props.show ? "popup" : "hidden"}
                onClick={() => this.props.hide()}>
                this.props.type
            </div>
        );
    }
}