import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TradeShowScreen from './TradeShowScreen';

const Tab = createBottomTabNavigator();

export default function TradeShow({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="TradeShow" component={TradeShowScreen} />
      </Tab.Navigator>
    );
}

