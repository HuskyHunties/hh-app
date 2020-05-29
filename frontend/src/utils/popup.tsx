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
 * Properties type for the Popup Component
 */
interface PopupProps {
}

/**
 * State type for the Popup Component
 */
interface PopupState {
    showPopup: boolean;
    popupType?: PopupTypes;
    popupMessage?: string;
    options?: Map<number, string>;
    inputValue: string;
    clickTypePromise: Promise<boolean>;
    clickTypeDefer?: DeferredPromise;
}

/**
 * Types for the object representing a deferred promise.
 */
interface DeferredPromise {
    resolve(value?: unknown): void;
    reject(value?: unknown): void;
}

/**
 * A component that displays a popup window and takes a response from the user.
 */
export default class Popup extends React.Component<PopupProps, PopupState> {
    constructor(props: PopupProps) {
        super(props);
        let deferred = undefined;
        var p = new Promise<boolean>(function (resolve, reject) {
            deferred = { resolve: resolve, reject: reject };
        });
        this.state = { showPopup: false, inputValue: "", clickTypePromise: p, clickTypeDefer: deferred};
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Creates a new, unresolved promise to wait for the user to click on a button.
     */
    private resetDeferred() {
        let deferred = undefined;
        var p = new Promise<boolean>(function (resolve, reject) {
            deferred = { resolve: resolve, reject: reject };
        });
        this.setState({ clickTypePromise: p, clickTypeDefer: deferred})
    }

    /**
    * Creates a pop up window.
    * @param type - the type of popup
    * @param message - the message to be displayed in the popup
    * @param onInput - the function to be executed when a user inputs a value to the popup
    * @param onConfirm - the function to be executed when a user confirms the question asked by the popup
    */
    public async popupFactory<T>(type: PopupTypes, message: string, options?: Map<number, string>): Promise<string> {
        this.setState({ showPopup: true, popupType: type, popupMessage: message, options: options });
        const confirm: boolean = await this.state.clickTypePromise;
        this.setState({ showPopup: false });
        this.resetDeferred();

        return new Promise<string>((resolve, reject) => {
            if (confirm) {
                if (this.state.popupType === PopupTypes.Input) {
                    this.setState({inputValue: ""});
                    resolve(this.state.inputValue);
                } else {
                    resolve();
                }
            } else {
                if (this.state.popupType === PopupTypes.Input) {
                    this.setState({inputValue: ""});
                }
                reject();
            }
        })
    }

    /**
     * Handles the clicking on the popup buttons.
     */
    private handleClick(confirm: boolean) {
        this.state.clickTypeDefer!.resolve(confirm);
    }

    /**
     * Creates the buttons for the confirm popup.
     * @returns a div containing those buttons
     */
    private confirm(): JSX.Element {
        return (
            <div className="popup-button">
                <button className="okay" onClick={() => this.handleClick(true)}>Okay</button>
                <button className="cancel" onClick={() => this.handleClick(false)}>Cancel</button>
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
                <button className="okay" onClick={() => this.handleClick(true)}>Okay</button>
                <button className="cancel" onClick={() => this.handleClick(false)}>Cancel</button>
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
                <button className="notif" onClick={() => this.handleClick(true)}>Okay</button>
            </div>
        );
    }

    /**
     * Renders the popup box
     */
    render() {
        let buttons: JSX.Element;
        // Creates the buttons depending on the popup type.
        switch (this.state.popupType) {
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
                buttons = (<div className="popup-button"></div>);
        }

        // Combines the buttons with the message.
        return (
            <div className={this.state.showPopup ? "popup" : "hidden"}>
                <div className="popup-text">
                    {this.state.popupMessage}
                </div>

                {buttons}
            </div>
        );
    }
}