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
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Clue, screenHeight, screenWidth } from '../utils/data';

// asks permission from the phone to access camera
const askForPermission = async () => {
  const permissionResult = await Permissions.askAsync(Permissions.CAMERA);

  if (permissionResult.status !== "granted") {
    Alert.alert("no permissions to access camera");
    return false;
  }
  return true;
};

interface ImagePageProps {
  clues: Clue[];
}

interface ImagePageState {
  selectedClue: number;
  displayedImage: string;
}

export default class ImagePage extends Component<
  ImagePageProps,
  ImagePageState
> {
  constructor(props: ImagePageProps) {
    super(props);

    this.state = {
      selectedClue: 0,
      displayedImage: "",
    };

    this.addImageToClue = this.addImageToClue.bind(this);
    //this.getClueIDs = this.getClueIDs.bind(this);
    this.takeImage = this.takeImage.bind(this);
    this.makePickerItems = this.makePickerItems.bind(this);
    //this.refreshState = this.refreshState.bind(this);
    this.openDirectionsToClue = this.openDirectionsToClue.bind(this);
  }

  // adds the given image string as base64 to the selected clue on the server
  addImageToClue(image: string) {
    API.put(`/clues/image/${this.state.selectedClue}`, {
      image: image,
    }).catch((error) => console.log(error));
  }

  //@ts-ignore
  componentDidMount() {}

  // takes the image with the camera and sends it to the server
  takeImage = async () => {
    // make sure that we have the permission
    const hasPermission = await askForPermission();
    if (!hasPermission) {
      return;
    } else {
      // launch the camera with the following settings
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.00001,
        base64: true,
      });
      // make sure a image was taken:
      if (!image.cancelled) {
        const base64string = image.base64!;
        this.addImageToClue(base64string);
      }
    }
  };

  // opens google maps with the coordinates loaded of the selected clue.
  openDirectionsToClue() {
    const selectedClue = this.props.clues.find((clue) => {
      return clue.id === Number(this.state.selectedClue);
    });

    if (selectedClue) {
      const url: string = `http://maps.google.com/maps?q=${selectedClue!.lat},${
        selectedClue!.long
      }`;
      Linking.openURL(url);
    }
  }

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
    image: {
      padding: 5,
    },
    picturebutton: { margin: 10, borderColor: "#a85858", borderWidth: 2 },
    directionsbutton: { margin: 10, borderColor: "#a85858", borderWidth: 2 },
    cluelist: {},
  });

  render() {
    return (
      <View style={this.styles.cluespage}>
        <View style={this.styles.image}>
          <Image
            source={{
              uri: `data:image/png;base64,${this.state.displayedImage}`,
            }}
            style={{ height: 300, width: 300 }}
          />
        </View>
        <View style={this.styles.picturebutton}>
          <Button
            title="Take a photo"
            onPress={this.takeImage}
            color="#a85858"
          />
        </View>
        <View style={this.styles.directionsbutton}>
          <Button
            title="Get Directions for selected clue"
            onPress={this.openDirectionsToClue}
            color="#a85858"
          />
        </View>
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
                  displayedImage: imageString,
                });
              }
            }}
          >
            {this.makePickerItems()}
          </Picker>
        </View>
      </View>
    );
  }
}
