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
import { diseaseallreport_API_Url } from "../../components/API/config/apiconfig";

const { width, height } = Dimensions.get("window");

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
      .get(diseaseallreport_API_Url)
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
