import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentCreate from './create/AppointmentCreate';
import TradeShow from './tradeshow/TradeShow';

const Tab = createBottomTabNavigator();

export default function Appointment({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="TradeShow" component={TradeShow} />
        <Tab.Screen name="AppointmentCreate" component={AppointmentCreate} />
      </Tab.Navigator>
    );
}

