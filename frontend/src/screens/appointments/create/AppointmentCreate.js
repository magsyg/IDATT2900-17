import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentCreateSelectScreen from './AppointmentCreateSelectScreen';

const Tab = createBottomTabNavigator();

export default function AppointmentCreate({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="AppointmentCreateSelect" component={AppointmentCreateSelectScreen} />
      </Tab.Navigator>
    );
}

