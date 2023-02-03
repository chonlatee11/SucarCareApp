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

// const baseUrl = 'https://jsonplaceholder.typicode.com/photos?_limit=10';
const baseUrl = 'http://192.168.1.22:3032/diseasereport';

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
      .post(`${baseUrl}`, {
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
      <View style={{paddingTop: '4%'}}>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15, alignItems: 'flex-end', alignContent: 'flex-end'}}>
            <TouchableOpacity>
            <Button style={{alignSelf: 'flex-start'}} onPress={Logout}>ออกจากระบบ</Button>
            </TouchableOpacity>
            </View>
          
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
              {userInfo.Address}
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
          <DataTable style={styles.userInfoSection}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
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
});

export default ProfileScreen;
