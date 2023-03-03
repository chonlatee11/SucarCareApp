import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../screens/login/SignInScreen';
import SignUpScreen from '../screens/register/SignUpScreen';
import AddressInput from '../screens/register/AddressInput';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen name='SignIn' component={SignInScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} /> 
            <Stack.Screen name='AddressInput' component={AddressInput} /> 
        </Stack.Navigator>
    );
  };
  
  export default AuthStack;