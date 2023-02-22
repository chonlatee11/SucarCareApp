import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';

export const AuthContex = createContext();

const baseUrl = 'http://192.168.219.153:3001/login';
// const baseUrl = 'https://www.melivecode.com/api/login';

export const AuthProvider = ({children}) => {
  const [isLoading, setisLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const Login = async (userName, passWord) => {
    setisLoading(true);
    // console.log(userName)
    // console.log(passWord)
    const response = await axios
      .post(`${baseUrl}`, {
        userName: userName,
        passWord: passWord,
      })
      .then(response => {
        let userInfo = response.data;
        // console.log(userInfo);
        if(userInfo.status === 401)
        {
          // console.log('Not found');
          Alert.alert('เกิดข้อผิดพลาด', 'ไม่พบข้อมูลผู้ใช้งาน');
        }else
        {
          setUserInfo(userInfo.user);
          setUserToken(userInfo.accessToken);
          AsyncStorage.setItem('userToken', userInfo.accessToken);
          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.user));
        }
        
        // console.log(userInfo.accessToken);
      })
      .catch(error => {
        Alert.alert('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        // console.log(error);
      });
    setisLoading(false);
  };

  const Logout = () => {
    setisLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userInfo');
    setisLoading(false);
  };

  const IsLogin = async () => {
    try {
      setisLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
        setUserToken(userToken);
      }
      setisLoading(false);
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  useEffect(() => {
    IsLogin();
  }, []);

  return (
    <AuthContex.Provider
      value={{Login, Logout, userToken, isLoading, userInfo}}>
      {children}
    </AuthContex.Provider>
  );
};
