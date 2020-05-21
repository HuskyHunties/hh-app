import React from 'react';
import './popup.css';

/**
 * An enum describing the different types of popup available.
 */
export enum PopupTypes {
    Confirm = "confirm",
    Input = "input",
    Notif = "notif"
}

/**
 * A function type that is used to create a popup.
 * This is only implemented by the popupFactory, but this type makes passing the function in props easier.
 */
export type PopupCreator = (type: PopupTypes, message: string, onInput?: (res: string) => void, onConfirm?: () => void) => void;

/**
 * Properties type for the Popup Component
 */
interface PopupProps {
    showPopup: boolean;
    popupType: PopupTypes;
    popupMessage: string;
    popupDoInput?(res: string): void;
    popupDoConfirm?(): void;
    hidePopup(): void;
}

/**
 * State type for the Popup Component
 */
interface PopupState {
    inputValue: string;
}

/**
 * A component that displays a popup window and takes a response from the user.
 */
export default class Popup extends React.Component<PopupProps, PopupState> {
    constructor(props: PopupProps) {
        super(props);
        this.state = { inputValue: "" };
    }

    /**
     * Handles the clicking on the popup buttons.
     * @param confirm Was the okay button clicked on a confirm popup?
     * @param input Was the okay button clicked on a input popup?
     * @param inputValue The input value on the input popup
     */
    private handleClick(confirm: boolean, input: boolean, inputValue?: string) {
        if (confirm) {
            (this.props.popupDoConfirm)!();
        } else if (input) {
            (this.props.popupDoInput)!(inputValue!);
        }

        this.setState({ inputValue: "" });
        this.props.hidePopup();
    }

    /**
     * Creates the buttons for the confirm popup.
     * @returns a div containing those buttons
     */
    private confirm(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="okay" onClick={() => this.handleClick(true, false)}>Okay</button>
                <button className="cancel" onClick={() => this.handleClick(false, false)}>Cancel</button>
            </div>);
    }

    /**
    * Creates the buttons and text field for the input popup.
    * @returns a div containing those buttons and the field
    */
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

    /**
    * Creates the button for the notif popup.
    * @returns a div containing that button
    */
    private notif(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="notif" onClick={() => this.handleClick(false, false)}>Okay</button>
            </div>
        );
    }

    /**
     * Renders the popup box
     */
    render() {
        let buttons: JSX.Element;
        // Creates the buttons depending on the popup type.
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

        // Combines the buttons with the message.
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