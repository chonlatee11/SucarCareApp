import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { AuthContex } from '../../components/AutContext/AutContext';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useForm } from 'react-hook-form';
import Logo from '../../../assets/logo.png';
import { useNavigation } from '@react-navigation/native'


const SignInScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm(
    { defaultValues: { username: '', password: '' }  }
  );
  const { height } = useWindowDimensions();
  const [isloding, setIsLoding] = useState(false);
  const {Login} = useContext(AuthContex);
  const navigation = useNavigation();

  const onSignInPressed = async (data) => {
    // console.log(data.username);
    // console.log(data.password);
    // console.log(userToken);

    // validate user
    if (isloding) return;
    setIsLoding(true);
    Login(data.username, data.password);
    setIsLoding(false);
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root} >
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <CustomInput
          label="ชื่อผู้ใช้งาน"
          name={'username'}
          control={control}
          rules={{ required: 'กรุณากรอกชื่อผู้ใช้งาน' }}
        />
        <CustomInput
          label="รหัสผ่าน"
          name={'password'}
          control={control}
          secureTextEntry={true}
          rules={{ required: 'กรุณากรอกรหัสผ่าน' }}
        />
        <CustomButton text={ isloding ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ' }  onPress={handleSubmit(onSignInPressed)} />
        <CustomButton
          text="สมัครใช้งาน"
          onPress={onSignUpPress}
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
    marginTop: 30,
  },
  logo: {
    width: '80%',
    maxWidth: 300,
    maxHeight: 400,
    marginBottom: 20,
  },
});

export default SignInScreen;