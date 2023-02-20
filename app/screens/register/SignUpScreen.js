import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, Button} from 'react-native';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import GetLocation from 'react-native-get-location';

const baseUrl = 'http://192.168.1.22:3001/register';

const SignUpScreen = () => {
  const [location, setLocation] = useState([]);

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        setLocation({
          location,
          loading: false,
        });
        // console.log(location);
      })
      .catch(ex => {
        const {code, message} = ex;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          Alert.alert('Location cancelled by user or by another request');
        }
        if (code === 'UNAVAILABLE') {
          Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          Alert.alert('Authorization denied');
        }
        setLocation({
          location: null,
          loading: false,
        });
      });
  };

  useEffect(() => {
    if (location.length === 0) {
      getLocation();
    }
  }, [location]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      repeatPassword: '',
      fname: '',
      lname: '',
      phoneNumber: '',
      address: '',
    },
  });
  const [isLoding, setIsLoding] = useState(false);
  const navigation = useNavigation();
  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onRegisterPress = async data => {
    if (isLoding) return;
    // console.log(location.location.longitude);
    setIsLoding(true);
    const res = await axios
      .post(`${baseUrl}`, {
        userName: data.username,
        passWord: data.password,
        fName: data.fname,
        lName: data.lname,
        phoneNumber: data.phoneNumber,
        address: data.address,
        latitude: location.location.latitude,
        longitude: location.location.longitude,
      })
      .then(response => {
        // console.log(response.status);
        if (response.status === 200) {
          Alert.alert('สมัครสมาชิกสำเร็จ', 'กรุณาเข้าสู่ระบบ');
          navigation.navigate('SignIn');
        }
      })
      .catch(error => {
        Alert.alert('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
        // console.log(error);
        return;
      });
    setIsLoding(false);
  };

  // const onTermsOfUsePressed = () => {
  //   console.warn('onTermsOfUsePressed');
  // };

  // const onPrivacyPressed = () => {
  //   console.warn('onPrivacyPressed');
  // };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>สมัครใช้งาน</Text>

        <CustomInput
          name={'username'}
          control={control}
          label="ชื่อผู้ใช้งาน"
          rules={{required: 'กรุณากรอกชื่อผู้ใช้งาน'}}
          
        />

        <CustomInput
          name={'password'}
          control={control}
          label="รหัสผ่าน"
          secureTextEntry
          rules={{required: 'กรุณากรอกรหัสผ่าน'}}
        />
        <CustomInput
          name={'repeatPassword'}
          control={control}
          label="ยืนยันรหัสผ่าน"
          secureTextEntry
          rules={{
            validate: value =>
              value === watch('password') || 'รหัสผ่านไม่ตรงกัน',
          }}
        />

        <CustomInput
          name={'fname'}
          control={control}
          label="ชื่อ"
          rules={{required: 'กรุณากรอกชื่อ'}}
        />

        <CustomInput
          name={'lname'}
          control={control}
          label="นามสกุล"
          rules={{required: 'กรุณากรอกนามสกุล'}}
        />

        <CustomInput
          name={'phoneNumber'}
          control={control}
          label="เบอร์โทรศัพท์"
          rules={{required: 'กรุณากรอกเบอร์โทรศัพท์', maxLength: 10}}
        />

        <CustomInput
          name={'address'}
          control={control}
          label="ที่อยู่"
          rules={{required: 'กรุณากรอกที่อยู่'}}
          multiline={true}
        />

        <CustomButton
          text={'สมัครใช้งาน'}
          onPress={handleSubmit(onRegisterPress)}
        />

        {/* <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text> */}

        <CustomButton
          text="เข้าสู่ระบบ"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'black',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default SignUpScreen;
