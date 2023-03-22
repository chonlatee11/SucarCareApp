import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
import {AuthContex} from '../../components/AutContext/AutContext';
import axios from 'axios';
import {
  Avatar,
  Title,
  Caption,
  Text,
  Divider,
  DataTable,
  Button,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { diseaseReport_API_Url } from "../../components/API/config/apiconfig";

const ProfileScreen = () => {
  const {userInfo, Logout} = useContext(AuthContex);
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
    const res = await axios
      .post(`${diseaseReport_API_Url}`, {
        userID: userInfo.UserID,
      })
      .then(response => {
        // console.log(response.status);
        if (response.status === 200) {
          setDiseaseData(response.data.data);
        }
      })
      .catch(error => {
        // console.log(error);
        return;
      });
    // console.log(diseaseData);
  };

  useEffect(() => {
    getDiseaseData();
  }, []);

  // console.log(userInfo);
  // console.log(diseaseData);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.box}>
          
          <View style={styles.inner}>
          <View style={{paddingTop: '4%'}}>
          <View style={{marginTop: 15, alignItems: 'flex-end', alignContent: 'flex-end'}}>
            <TouchableOpacity>
            <Button style={{alignSelf: 'flex-end'}} onPress={Logout}>ออกจากระบบ</Button>
            </TouchableOpacity>
            </View>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Text size={80} label={userInfo.fName.charAt(0) + userInfo.lName.charAt(0)} />
            <View style={{marginLeft: 20}}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 15,
                    marginBottom: 5,
                  },
                ]}>
                ยินดีต้อนรับ
              </Title>
              <Caption style={styles.caption}>
                {userInfo.fName} {userInfo.lName}
              </Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              color="#777777"
              size={20}
            />
            <Text style={{color: '#777777', marginLeft: 20}}>
              {userInfo.detailAddress} {'ตำบล'} {userInfo.subDistrict} {'อำเภอ'} {userInfo.district} {'จังหวัด'} {userInfo.province} {userInfo.zipCode}
            </Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="phone" color="#777777" size={20} />
            <Text style={{color: '#777777', marginLeft: 20}}>
              {userInfo.PhoneNumber}
            </Text>
          </View>
        </View>

        {/* <View style={styles.horizonRule} /> */}

        <View>
          <DataTable style={styles.tableSection}>
            <DataTable.Header>
              <DataTable.Title>ประวัติการรายงานโรค</DataTable.Title>
            </DataTable.Header>
            {diseaseData.map(diseaseData => {
              return (
                <DataTable.Row
                  key={diseaseData.ReportID}
                  onPress={() => {
                    // console.log(`selected account ${diseaseData.DiseaseName}`);
                  }}>
                  <DataTable.Cell>{diseaseData.DateReport}</DataTable.Cell>
                  <DataTable.Cell>{diseaseData.DiseaseName}</DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </View>
      </View>
            </View>
        </View>
            </ScrollView>
      
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  horizonRule: {
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 30,
    marginRight: 30,
  },
  dataTableStyle: {
    display: 'flex',
    fontSize: 12,
    textAlignments: 'left',
  },
  //dont use this
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  box: {
    width: "100%",
    height: "100%",
    // padding: "5%",
    // backgroundColor: "red",
  },
  inner: {
    flex: 1,
    // backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tableSection: {
    width: '100%',
    // backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default ProfileScreen;
