import React, { useState } from 'react'
import LoginScreen from './login/LoginScreen';
import ResetPasswordScreen from './login/ResetPasswordScreen';
import Register  from './register/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function Authentication({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Tab.Screen name="Register" component={Register} />

      </Tab.Navigator>
    );
}

