import { screenHeight, screenWidth } from "../utils/data";
import React, { Component } from "react";
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
import API from "../utils/API";

interface CreateGroupPathPageProps {}

interface CreateGroupPathPageState {
  name: string;
}
export default class CreateGroupPathPage extends Component<
  CreateGroupPathPageProps,
  CreateGroupPathPageState
> {
  constructor(props: CreateGroupPathPageProps) {
    super(props);

    this.state = { name: "" };

    this.addGroup = this.addGroup.bind(this);
    this.addPath = this.addPath.bind(this);
  }

  // sends API request to create group with the entered name
  addGroup() {
    if (this.state.name !== "") {
      API.post("/groups", { name: this.state.name }).catch((error) =>
        console.log(error)
      );
    }
    this.setState({ name: "" });
  }

  // sends API request to create group with the entered name
  addPath() {
    if (this.state.name !== "") {
      API.post("/paths", { name: this.state.name }).catch((error) =>
        console.log(error)
      );
    }
    this.setState({ name: "" });
  }

  styles = StyleSheet.create({
    createpage: {
      position: "relative",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      width: screenWidth,
      height: screenHeight * 0.9,
      left: 0,
      backgroundColor: "#121212",
      color: "white",
    },
    nameField: {
      position: "relative",
      height: 50,
      width: screenWidth * 0.75,
      backgroundColor: "white",
      borderColor: "#a85858",
      borderWidth: 2,
      color: "black",
      fontSize: 30,
    },
    groupButton: {
      position: "relative",
      margin: 10,
      color: "black",
      borderColor: "#a85858",
      borderWidth: 2,
    },
    pathButton: {
      position: "relative",
      margin: 10,
      color: "black",
      borderColor: "#a85858",
      borderWidth: 2,
    },
  });
  render() {
    return (
      <View style={this.styles.createpage}>
        <TextInput
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
          style={this.styles.nameField}
        />
        <View style={this.styles.groupButton}>
          <Button title="Add Group" onPress={this.addGroup} color="#a85858" />
        </View>
        <View style={this.styles.pathButton}>
          <Button title="Add Path" onPress={this.addPath} color="#a85858" />
        </View>
      </View>
    );
  }
}
