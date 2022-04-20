import React, { useState } from 'react'
import CompanyMemberScreen from './CompanyMemberScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
export default function Members({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="CompanyMember" component={CompanyMemberScreen} />      
      </Tab.Navigator>
    );
}

