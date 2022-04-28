import React, { useState } from 'react'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsShowroomSelect from './SettingsShowroomSelect';
import SettingsShowroomCreate from './SettingsShowroomCreate';
import SettingsShowroomEdit from './SettingsShowroomEdit';

const Tab = createBottomTabNavigator();

export default function SettingsShowroom({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="SettingsShowroomSelect" component={SettingsShowroomSelect} />
        <Tab.Screen name="SettingsShowroomCreate" component={SettingsShowroomCreate} />
        <Tab.Screen name="SettingsShowroomEdit" component={SettingsShowroomEdit} />
      </Tab.Navigator>
    );
}

