import React, { useState, useEffect } from "react";

import API from "./utils/API";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

const askForPermission = async () => {
  const permissionResult = await Permissions.askAsync(Permissions.CAMERA);

  if (permissionResult.status !== "granted") {
    Alert.alert("no permissions to access camera");
    return false;
  }
  return true;
};

export default function App(this: any) {
  const [clueIDs, setClueIDs] = useState([0]);
  const [clueToChange, changeClue] = useState(1);
  const [displayedImage, setImage] = useState("");

  function addImageToClue(image: string) {
    API.put(`/clues/${clueToChange}`, {
      image: image,
    }).catch((error) => console.log(error));
  }

  function getImageOfClue() {
    //console.log(clueToChange)
    API.get(`/clues/${clueToChange}`)
      .then((res) => res.data)
      .then((data) => {
        //console.log(data.image)
        setImage(data.image);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getClueIDs()
      .then((clueIDs) => {
        //console.log(clueIDs);
        setClueIDs(clueIDs);
      })
      .catch((error) => console.log(error));

    getImageOfClue();
  });

  function getClueIDs(): Promise<number[]> {
    //console.log("Getting ids");
    return new Promise(async (resolve, reject) => {
      const ids = (await API.get("/clues", {})).data;
      let clueIDs = ids.clueIDs;
      clueIDs.sort();
      resolve(clueIDs);
    });
  }

  const takeImage = async () => {
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
        //console.log(base64string);
        addImageToClue(base64string);
      }
    }
  };

  function makePickerItems(): Picker.Item[] {
    let items: Picker.Item[] = [];

    clueIDs.forEach((id) => {
      items.push(<Picker.Item label={`Clue: ${id}`} value={id} key={id} />);
    });

    return items;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
    container2: {
      flex: 3,
      flexDirection: "column",
      backgroundColor: "white",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `data:image/png;base64,${displayedImage}` }}
        style={{ height: 500, width: 500 }}
      />
      <View style={styles.container2}>
      <Picker
          prompt="Pick a clue"
          selectedValue={clueToChange}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) => changeClue(itemValue)}
        >
          {makePickerItems()}
        </Picker>
        <Button title="Take a photo" onPress={takeImage} />
        
          
      </View>
    </View>
  );
}
