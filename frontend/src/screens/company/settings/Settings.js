import React, { useState } from 'react'
import SettingsSelectScreen  from './SettingsSelectScreen';
import SettingsProfileScreen  from './SettingsProfileScreen';
import SettingsTeamScreen  from './SettingsTeamScreen';
import SettingsTeamCodeScreen  from './SettingsTeamCodeScreen';
import SettingsCompanyScreen from './SettingsCompanyScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsShowroom from './showroomsettings/SettingsShowroom';

const Tab = createBottomTabNavigator();

export default function Settings({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="SettingsSelect" component={SettingsSelectScreen} />
        <Tab.Screen name="SettingsProfileScreen" component={SettingsProfileScreen} />
        <Tab.Screen name="SettingsTeamScreen" component={SettingsTeamScreen} />
        <Tab.Screen name="SettingsTeamCodeScreen" component={SettingsTeamCodeScreen} />
        <Tab.Screen name="SettingsCompanyScreen" component={SettingsCompanyScreen} />
        <Tab.Screen name="SettingsShowroom" component={SettingsShowroom} />
      </Tab.Navigator>
    );
}

