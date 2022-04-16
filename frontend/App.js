import React,{ Component} from 'react'
import axios from 'axios';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { baseURL } from './config';
import {
  LoginScreen,
  ResetPasswordScreen,
  Dashboard,
  Register,
  Settings,
  Calendar,
  Company

} from './src/screens';
import Appointment from './src/screens/appointments/Appointment';

const Stack = createStackNavigator()

export default class App extends Component {
  UNSAFE_componentWillMount() {
    axios.defaults.baseURL = baseURL;
    axios.defaults.timeout = 3000;
    axios.defaults.headers.common.Authorization = `Token 03d6a57eb70f2e04554da921fb3cb9d92c50f3a3`; //TEST TOKEN
  }

  render() {
    return (
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Company" component={Company} />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
