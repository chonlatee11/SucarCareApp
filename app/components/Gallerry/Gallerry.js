import { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PhotoContext } from "../hook/photoContext";
import axios from "axios";
import Button from "../Camera/Button";
import ImageViewer from "./ImageViewer";
import { predic_API_Url } from "../API/config/apiconfig";

const PlaceholderImage = require("../../assets/BGWhite.png");

export default function GalleryScreen() {
  const { Photo, IsPicture, SetPredict, UseGallerry } =
    useContext(PhotoContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [isloading, setIsloading] = useState(false)

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result.uri);
      setSelectedImage(result);
      setShowImage(result.uri);
    } else {
      alert("You did not select any image.");
    }
  };

  let Usepic = () => {
    let localUri = selectedImage.uri;
    let filename = localUri.split("/").pop();
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    Photo(localUri, type, filename);
    let formData = new FormData();
    formData.append("file", {
      uri: localUri,
      type: type,
      name: filename,
    });
    // console.log(formData);
    setIsloading(true)
    axios
      .post(predic_API_Url, formData, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let resualt = response.data;
        if (resualt.status_code == 200) {
          SetPredict(
            resualt.status_code,
            resualt.probability,
            resualt.predicted_label
          );
          IsPicture(false);
          UseGallerry(false);
          setIsloading(false)
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  if(isloading === true) {
    return(
      <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#00ff00" />
  </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={showImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="เลือกรูปภาพ" onPress={pickImageAsync} />
        <Button label="ใช้รูปนี้" onPress={Usepic} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3333",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
