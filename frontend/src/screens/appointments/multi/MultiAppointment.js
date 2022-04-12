import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MultiAppointmentScreen from './MultiAppointmentScreen';
import MultiAppointmentBrandScreen from './MultiAppointmentBrandScreen';

const Tab = createBottomTabNavigator();

export default function MultiAppointment({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="MultiAppointmentScreen" component={MultiAppointmentScreen} />
        <Tab.Screen name="MultiAppointmentBrand" component={MultiAppointmentBrandScreen} />
      </Tab.Navigator>
    );
}

