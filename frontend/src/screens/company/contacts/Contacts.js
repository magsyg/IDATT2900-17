import React, { useState } from 'react'
import CompanyContactsScreen from './ContactsScreen';;
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
export default function Contacts({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="CompanyContacts" component={CompanyContactsScreen} />      
      </Tab.Navigator>
    );
}

