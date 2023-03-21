import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Card, Paragraph } from "react-native-paper";
import axios from "axios";
import { getDisease_API_Url, ip } from "../../components/API/config/apiconfig";

const CardItem = ({ item }) => {
  const [readMore, setReadMore] = useState(false);
  return (
    <Card style={styles.CardStyle}>
      <Card.Cover source={{ uri: `${item.ImageUrl}` }} />
      <Card.Content>
        <Card.Title title={item.DiseaseName} />
        <Paragraph numberOfLines={readMore ? 0 : 2}>
          {item.InfoDisease}
        </Paragraph>
        <Paragraph numberOfLines={readMore ? 0 : 2}>
          คำแนะนำการป้องกันโรค {item.ProtectInfo}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setReadMore(!readMore)}>
          {readMore ? "ย่อ" : "อ่านเพิ่มเติม"}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const DiseaseScreen = () => {
  let [diseaseData, setDiseaseData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getDiseaseData();
      setRefreshing(false);
    }, 2000);
  }, []);

  const getDiseaseData = async () => {
    const response = await axios
      .get(getDisease_API_Url)
      .then((response) => {
        setDiseaseData(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(() => {
    getDiseaseData();
  }, []);

  // console.log(diseaseData.data);
  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={diseaseData}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={({ item }) => <CardItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10%",
  },
  CardStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});

export default DiseaseScreen;
