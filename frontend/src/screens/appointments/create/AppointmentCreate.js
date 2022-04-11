import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentCreateSelectScreen from './AppointmentCreateSelectScreen';
import AppointmentCreateScreen from './AppointmentCreateScreen';
import AppointmentCreateShowroomSearchScreen from './AppointmentCreateShowroomSearchScreen';
const Tab = createBottomTabNavigator();

export default function AppointmentCreate({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="AppointmentCreateSelect" component={AppointmentCreateSelectScreen} />
        <Tab.Screen name="AppointmentCreateShowroomSearchScreen" component={AppointmentCreateShowroomSearchScreen} />
        <Tab.Screen name="AppointmentCreateForm" component={AppointmentCreateScreen} />
      </Tab.Navigator>
    );
}

