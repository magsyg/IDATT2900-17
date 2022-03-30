import React, { useState } from 'react'
import SettingsSelectScreen  from './SettingsSelectScreen';
import SettingsProfileScreen  from './SettingsProfileScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function Settings({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="SettingsSelect" component={SettingsSelectScreen} />
        <Tab.Screen name="SettingsProfileScreen" component={SettingsProfileScreen} />
      </Tab.Navigator>
    );
}

