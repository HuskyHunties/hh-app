import React, { Component } from "react";

import API from "../utils/API";
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    Picker,
    Dimensions,
    useWindowDimensions,
    Linking,
} from "react-native";
import { Clue, screenHeight, screenWidth } from '../utils/data';

interface addClueToPathPageProps {
    clues: Clue[];
    pathID?: number;
}

interface addClueToPathPageState {
    selectedClue: number;
}

export default class addClueToPathPage extends Component<
    addClueToPathPageProps,
    addClueToPathPageState
    > {
    constructor(props: addClueToPathPageProps) {
        super(props);

        this.state = {
            selectedClue: 0,
        };

        this.makePickerItems = this.makePickerItems.bind(this);
        this.addClueToPath = this.addClueToPath.bind(this);
    }

    //@ts-ignore
    componentDidMount() { }

    // @ts-ignore
    // makes the list of clues for the dropdown menu
    makePickerItems(): Picker.Item[] {
        // @ts-ignore
        let items: Item[] = [
            <Picker.Item color="white" label="Select a clue" value={0} key={0} />,
        ];

        this.props.clues.forEach((clue, index) => {
            items.push(
                <Picker.Item
                    label={`${clue.listID}${clue.clueNumber}: ${clue.name}`}
                    value={clue.id}
                    key={clue.id}
                    color="white"
                />
            );
        });

        return items;
    }

    // sends an API request to add the selected clue to the selected path in the app's state
    addClueToPath() {
        if (this.props.pathID) {
            API.put(`/paths/${this.props.pathID}/clue/override`, { clueID: this.state.selectedClue })
                .catch((error) => console.log(error));
        }
    }

    styles = StyleSheet.create({
        cluespage: {
            position: "absolute",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: screenWidth,
            height: screenHeight * 0.9,
            left: 0,
            backgroundColor: "#121212",
        },
        addbutton: { margin: 10, borderColor: "#a85858", borderWidth: 2 },
        cluelist: {},
    });

    render() {
        return (
            <View style={this.styles.cluespage}>
                <View style={this.styles.cluelist}>
                    <Picker
                        prompt="Pick a clue"
                        selectedValue={this.state.selectedClue}
                        style={{ height: 40, width: 300, color: "white" }}
                        onValueChange={async (itemValue, itemIndex) => {
                            if (itemValue != 0) {
                                const imageString: string = (
                                    await API.get(`/clues/${Number(itemValue)}/image`)
                                ).data.image;
                                this.setState({
                                    selectedClue: itemValue,
                                });
                            }
                        }}
                    >
                        {this.makePickerItems()}
                    </Picker>
                </View>
                <View style={this.styles.addbutton}>
                    <Button title="Add Clue to Path" onPress={this.addClueToPath} color="#a85858" />
                </View>
            </View>
        );
    }
}


