import React,{ Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { baseURL } from './config';
import {CurrentUserProvider} from './Context';

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
  Contact,
} from './src/screens';
import { Provider } from 'react-native-paper';

const Stack = createStackNavigator()
export default class App extends Component {
  render() {
    return (
      <CurrentUserProvider>
      <Provider theme={theme}>

        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Dashboard"
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
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="AppointmentCreate" component={AppointmentCreate} />
            <Stack.Screen name="Showroom" component={Showroom} />
            <Stack.Screen name="MultiAppointment" component={MultiAppointment} />
          </Stack.Navigator>
        </NavigationContainer>
        </Provider>
      </CurrentUserProvider>
    );
  }
}
