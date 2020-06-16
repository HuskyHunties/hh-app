import {  Group, Path, screenHeight, screenWidth } from '../utils/data';
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

interface SelectGroupPathPageProps {
  groups: Map<number, Group>;
  selectedGroupID: number;
  updateGroup: Function;
  paths: Map<number, Path>;
}

interface SelectGroupPathPageState {
  selectedPathID: number;
}

export default class SelectGroupPathPage extends Component<
  SelectGroupPathPageProps,
  SelectGroupPathPageState
> {
  constructor(props: SelectGroupPathPageProps) {
    super(props);
    this.state = { selectedPathID: 0 };

    this.overridePath = this.overridePath.bind(this);
    this.removePathFromGroup = this.removePathFromGroup.bind(this);
  }

  // sends a request to the server to override the path selection for the selected group
  overridePath() {
    if (this.props.selectedGroupID && this.state.selectedPathID) {
      API.put(`/groups/${this.props.selectedGroupID}/override`, {
        pathID: this.state.selectedPathID,
      }).catch((error) => console.log(error));
    }
  }

  // sends a request to the server to remove the path selection for the selected group
  removePathFromGroup() {
    if (this.props.selectedGroupID) {
      API.delete(`/groups/${this.props.selectedGroupID}/path`).catch((error) => console.log(error));
    }
  }
  // makes all the group items for the dropdown
  makeGroupPickerItems() {
    // @ts-ignore
    let items: Item[] = [
      <Picker.Item color="white" label="Select a group" value={0} key={0} />,
    ];

    this.props.groups.forEach((group, index) => {
      items.push(
        <Picker.Item
          label={`${group.name} -- ${this.props.paths.get(group.pathID)?.name}`}
          value={group.groupID}
          key={group.groupID}
          color="white"
        />
      );
    });

    return items;
  }

  // makes all the path items for the dropdown
  makePathPickerItems() {
    // @ts-ignore
    let items: Item[] = [
      <Picker.Item color="white" label="Select a path" value={0} key={0} />,
    ];

    this.props.paths.forEach((path, index) => {
      if (path) {
        items.push(
          <Picker.Item
            label={`${path.name}`}
            value={path.pathID}
            key={path.pathID}
            color="white"
          />
        );
      }
    });

    return items;
  }

  styles = StyleSheet.create({
    selectpage: {
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
    grouptext: {
      fontSize: 20,
      color: "white",
    },
    grouppathtext: {
      fontSize: 20,
      color: "white",
    },
    grouplist: {
    },
    selectedpathtext: {
      position: "relative",
      fontSize: 20,
      color: "white",
      marginTop: screenHeight/3
    },
    pathlist: {
      position: "relative",
    },
    overridepathbutton: {
      position: "relative",
    },
  });

  render() {
    return (
      <View style={this.styles.selectpage}>
        <Text style={this.styles.grouptext}>{`Selected Group: ${
          this.props.groups.get(this.props.selectedGroupID)?.name
        }`}</Text>
        <Text style={this.styles.grouppathtext}>{`Selected Group's Path: ${
          this.props.paths.get(
            //@ts-ignore
            this.props.groups.get(this.props.selectedGroupID)?.pathID
          )?.name
        }`}</Text>
        <Button
            title="Remove Path Assignment"
            onPress={this.removePathFromGroup}
            color="#a85858"
          />
        <View style={this.styles.grouplist}>
          <Picker
            prompt="Pick a group"
            selectedValue={this.props.selectedGroupID}
            style={{ height: 20, width: 300, color: "white" }}
            onValueChange={(itemValue, itemIndex) =>
              this.props.updateGroup(Number(itemValue))
            }
          >
            {this.makeGroupPickerItems()}
          </Picker>
        </View>

        <Text style={this.styles.selectedpathtext}>{`Selected Path: ${
          //@ts-ignore
          this.props.paths.get(this.state.selectedPathID)?.name
        }`}</Text>
        <View style={this.styles.overridepathbutton}>
          <Button
            title="Assign Path with Override"
            onPress={this.overridePath}
            color="#a85858"
          />
          
        </View>
        <View style={this.styles.pathlist}>
          <Picker
            prompt="Pick a path"
            selectedValue={this.state.selectedPathID}
            style={{ height: 20, width: 300, color: "white" }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedPathID: Number(itemValue) })
            }
          >
            {this.makePathPickerItems()}
          </Picker>
        </View>
        
      </View>
    );
  }
}
