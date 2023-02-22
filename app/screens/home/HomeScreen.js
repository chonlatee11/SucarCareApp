import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { AuthContex } from "../../components/AutContext/AutContext";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { StatusBar } from "expo-status-bar";

const baseUrl = "http://192.168.219.153:3002/diseaseallreport";
const { width, height } = Dimensions.get("window");
// const markers = [
//   {
//     ReportID: 1,
//     latitude: 37.8022259,
//     longitude: -122.4351431,
//     title: 'Amazing Food Place',
//     description: 'This is the best food place',
//     rating: 4,
//     reviews: 99,
//   },
//   {
//     ReportID: 2,
//     latitude: 37.7896386,
//     longitude: -122.421646,
//     title: 'Second Amazing Food Place',
//     description: 'This is the second best food place',
//     rating: 5,
//     reviews: 102,
//   },
//   {
//     ReportID: 3,
//     latitude: 37.7665248,
//     longitude: -122.4161628,

//     title: 'Third Amazing Food Place',
//     description: 'This is the third best food place',
//     rating: 3,
//     reviews: 220,
//   },
//   {
//     ReportID: 4,

//     latitude: 37.7734153,
//     longitude: -122.4577787,

//     title: 'Fourth Amazing Food Place',
//     description: 'This is the fourth best food place',
//     rating: 4,
//     reviews: 48,
//   },
//   {
//     ReportID: 5,
//     latitude: 37.7948605,
//     longitude: -122.4596065,
//     title: 'Fifth Amazing Food Place',
//     description: 'This is the fifth best food place',
//     rating: 4,
//     reviews: 178,
//   },
// ];

// const Marker = () => {
//   return (
//     <View style={styles.marker}>
//       <View style={styles.ring} />
//     </View>
//   );
// }

const HomeScreen = () => {
  const { userInfo } = useContext(AuthContex);
  let [diseaseReport, setDiseaseReport] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getDiseaseReport();
      setRefreshing(false);
    }, 2000);
  }, []);

  const getDiseaseReport = async () => {
    axios
      .get(baseUrl)
      .then((response) => {
        setDiseaseReport(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  // console.log(userInfo);
  // console.log(diseaseReport.data);

  // console.log(width);
  // console.log(height);
  const ASPECT_RATIO = width / height;
  const LATITUDE = parseFloat(userInfo.latitude);
  const LONGITUDE = parseFloat(userInfo.longitude);
  const LATITUDE_DELTA = 0.05;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const SAMPLE_REGION = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0.04,
    longitudeDelta: LONGITUDE_DELTA,
  };

  useEffect(() => {
    getDiseaseReport();
  }, []);

  return (
    <ScrollView
      style={styles.scroolview}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.viewcontainer}>
        <StatusBar style="auto" hidden={true} />
        <MapView style={styles.map} initialRegion={SAMPLE_REGION}>
          {diseaseReport.map((marker) => (
            <Marker
              key={marker.ReportID}
              coordinate={{
                latitude: parseFloat(marker.Latitude),
                longitude: parseFloat(marker.Longitude),
              }}
              title={marker.DiseaseName}
            ></Marker>
          ))}
        </MapView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroolview: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
    width: width,
    height: height,
  },
  viewcontainer: {
    flex: 1,
    position: "relative",
    paddingTop: "0%",
  },
});
export default HomeScreen;
