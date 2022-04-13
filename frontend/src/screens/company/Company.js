import React, { useState } from 'react'
import Settings  from './settings/Settings';
import CompanyContactsScreen from './CompanyContactsScreen';
import CompanyMemberScreen from './CompanyMemberScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();
export default function Company({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="CompanyContacts" component={CompanyContactsScreen} />
        <Tab.Screen name="ProfileScreen" component={CompanyMemberScreen}/>
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    );
}

