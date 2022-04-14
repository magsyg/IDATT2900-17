import React, { useState } from 'react'
import ContactBrandScreen from './ContactBrand';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScheduleContactBrandScreen from './ScheduleContactBrand';

const Tab = createBottomTabNavigator();
export default function Brand({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="ContactBrand" component={ContactBrandScreen} />
        <Tab.Screen name="ScheduleContactBrand" component={ScheduleContactBrandScreen} />
      </Tab.Navigator>
    );
}

