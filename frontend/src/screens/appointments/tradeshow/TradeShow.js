import React, { useState } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TradeShowScreen from './TradeShowScreen';
import TradeShowBrandScreen from './TradeShowBrandScreen';

const Tab = createBottomTabNavigator();

export default function TradeShow({ navigation }) {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="TradeShowScreen" component={TradeShowScreen} />
        <Tab.Screen name="TradeShowBrand" component={TradeShowBrandScreen} />
      </Tab.Navigator>
    );
}

