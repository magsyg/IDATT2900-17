import React,{ Component,} from 'react'
import axios from 'axios';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { baseURL } from './config';

import {
  Authentication,
  AppointmentCreate,
  Dashboard,
  Showroom,
  MultiAppointment,
  Settings,
  Calendar,
  Contacts,
  Members,
  Brand,
} from './src/screens';

const Stack = createStackNavigator()

export default class App extends Component {
  UNSAFE_componentWillMount() {
    axios.defaults.baseURL = baseURL;
    axios.defaults.timeout = 3000;
    axios.defaults.headers.common.Authorization = `Token 71fdc88b4a624e06b28cecd120e1937bcc34b25c`; //TEST TOKEN
  }

  render() {
    return (
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Authentication"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Authentication" component={Authentication} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Contacts" component={Contacts} />
            <Stack.Screen name="Members" component={Members} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Brand" component={Brand} />
            <Stack.Screen name="AppointmentCreate" component={AppointmentCreate} />
            <Stack.Screen name="Showroom" component={Showroom} />
            <Stack.Screen name="MultiAppointment" component={MultiAppointment} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
