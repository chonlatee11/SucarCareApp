import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '.././screens/home/HomeScreen';
import ProfileScreen from '.././screens/profile/ProfileScreen';
import DiseaseScreen from '.././screens/disease/DiseaseScreen';
import DiseaseAnalyScreen from '.././screens/diseaseAnalysis/DiseaseAnalyScreen';
import HelpScreen from '.././screens/help/HelpScreen';


const Tab = createMaterialBottomTabNavigator();

// const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    
    <Tab.Navigator
      screenOptions={{headerShown: true}}
      initialRouteName="Home"
      activeColor="#FFFF"
      barStyle={{backgroundColor: 'skyblue'}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'ข้อมูลการระบาด',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="DiseaseAnaly"
        component={DiseaseAnalyScreen}
        options={{
          tabBarLabel: 'วิเคราะห์โรคอ้อย',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="image-search"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Disease"
        component={DiseaseScreen}
        options={{
          tabBarLabel: 'ข้อมูลโรคอ้อย',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="book-open-blank-variant"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{
          tabBarLabel: 'คู่มือการใช้งาน',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="note" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'โปรไฟล์',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  
  );
};

export default AppStack;
