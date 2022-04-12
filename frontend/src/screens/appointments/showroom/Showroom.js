import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShowroomScreen from './ShowroomScreen';

const Tab = createBottomTabNavigator();

export default function Showroom({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="ShowroomScreen" component={ShowroomScreen} />
      </Tab.Navigator>
    );
}

