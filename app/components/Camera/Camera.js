import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ActivityIndicator
} from "react-native";
import { useEffect, useRef, useState, useContext } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import CircleButton from "./CircleButton";
import Button from "./Button";
import { PhotoContext } from "../hook/photoContext";
import axios from "axios";

import { predic_API_Url } from "../API/config/apiconfig";


export default function CameraSreen() {
  const { Photo, photo, IsPicture, SetPredict, UseCamera } =
    useContext(PhotoContext);
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [PickImage, setPickImage] = useState();
  const [isloading, setIsloading] = useState(false)

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPickImage = await cameraRef.current.takePictureAsync(options);
    setPickImage(newPickImage);
  };

  if (PickImage) {
    let SavePic = () => {
      let localUri = PickImage.uri;
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
            UseCamera(false);
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
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + PickImage.base64 }}
        />
        {hasMediaLibraryPermission ? (
          <Button
            theme="primary"
            icon={"check"}
            label="ใช้รูปนี้"
            onPress={() => {
              SavePic();
            }}
          />
        ) : undefined}
        <Button
          theme="primary"
          icon={"undo"}
          label="ถ่ายใหม่"
          onPress={() => {
            setPickImage(undefined);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.TexContainer}>
        <Text style={styles.Text}>กรุณาทำให้รูปอยู่ภายในกรอบสีแดง</Text>
      </View>

      <View style={styles.backCover}></View>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <CircleButton onPress={takePic} />
        </View>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: "10%",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    maxWidth: 350,
    maxHeight: 450,
    borderRadius: 10,
    margin: 10,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  backCover: {
    position: "absolute",
    marginTop: 20,
    borderWidth: 5,
    borderColor: "red",
    opacity: 0.5,
    width: "75%",
    height: "50%",
    backgroundColor: "transparent",
  },
  TexContainer: {
    position: "absolute",
    top: "20%",
  },
  Text: {
    color: "white",
    opacity: 0.9,
    fontSize: 20,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
