import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import { login_API_URL } from "../API/config/apiconfig";

export const AuthContex = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setisLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const Login = async (userName, passWord) => {
    setisLoading(true);
    // console.log(userName)
    // console.log(passWord)
    const response = await axios
      .post(`${login_API_URL}`, {
        userName: userName,
        passWord: passWord,
      })
      .then(response => {
        let userInfo = response.data;
        // console.log(userInfo.status=== 401);
        if(userInfo.status === 401)
        {
          // console.log('Not found');
          Alert.alert('เกิดข้อผิดพลาด', 'ไม่พบข้อมูลผู้ใช้งาน');
        }else if(userInfo.status === 402)
        {
          Alert.alert('เกิดข้อผิดพลาด', 'กรุณาตรวจสอบรหัสผ่าน');
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
