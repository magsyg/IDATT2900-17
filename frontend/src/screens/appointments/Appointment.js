import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentCreate from './create/AppointmentCreate';
import Showroom from './showroom/Showroom';
import MultiAppointment from './multi/MultiAppointment';

const Tab = createBottomTabNavigator();
export default function Appointment({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="AppointmentCreate" component={AppointmentCreate} />
        <Tab.Screen name="MultiAppointment" component={MultiAppointment} />
        <Tab.Screen name="Showroom" component={Showroom} />
      </Tab.Navigator>
    );
}

