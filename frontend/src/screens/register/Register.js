import React, { useState } from 'react'
import RegisterCompanyScreen  from './RegisterCompanyScreen';
import RegisterScreen from './RegisterScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function Register({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="RegisterCompany" component={RegisterCompanyScreen} />
        <Tab.Screen name="RegisterScreen" component={RegisterScreen} />
      </Tab.Navigator>
    );
}

