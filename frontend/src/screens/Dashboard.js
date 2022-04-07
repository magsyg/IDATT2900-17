import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { TouchableOpacity, StyleSheet, View, ScrollView, Text} from 'react-native'
import { Avatar , DataTable } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Link from '../components/Link'
import PillLink from '../components/PillLink'
import { currentDate } from '../utils/date_management'
import { placeholder } from '../core/placeholders'
import { theme } from '../core/theme'
import CalendarFull from '../components/calendar/Calendar.js'
import AgendaScreen from '../components/calendar/Agenda.js'
import HoveringBar from '../components/HoveringBar.js'

export default function Dashboard({ navigation }) {
  const today = currentDate()
  const user = ({
    first_name: 'boop'
  }) 
/*
  const [user, setUser] = useState({ first_name:"" })

  useEffect(() => {
    axios.get().then((response) => {
      console.log(response.data)
    })
    axios.get('/accounts/current_user/').then((response) => {
      setUser(response.data);
      console.log(response.data)
    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log("-----axios----")
    });
  }, []);
  */
  // showCalendar = true displays the Calendar, showCalendar = false displays the Agenda
  let showCalendar = true;
  const changeCalendar = () => {
    console.log(showCalendar)
    return showCalendar = !showCalendar;
  }

  return (
    <Background>
      <View style = {styles.column}>
        <View style={[styles.row, {flex:2, paddingTop:32}]}>
          <View style={{flex: 3}}>
            <Header>Hi, {user.first_name}</Header>
          </View>
          <View style={{flex: 1}}>
            <Avatar.Image 
              size={64} 
              source={require('../assets/default_profile.png')}  
            />
          </View>
        </View>
        <Header>Notifications</Header> 
        <View style={{flex:3}}>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
        </View>

        <View style={[styles.column, {flex:3}]}>
          <View style={[styles.row, {flex:0, justifyContent: 'space-between'}]}>
              <Header style={{fontSize: 24}}>Today, {today}</Header>
              <View style={{top:16}}>
                <Link>All</Link>
              </View>
          </View>
          <ScrollView style={[styles.column, {flex:1}]}>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
            <View style={[styles.row,{flex:1}]}>
              <Text style={{flex:2}}>0900-0930</Text>
              <Text style={{flex:2}}>Appointment</Text>
              <Text style={{flex:1}}>SR</Text>
            </View>
          </ScrollView>
        </View>         
        <Button mode="contained" style = {styles.button}  onPress={changeCalendar}/>
        { showCalendar ? <CalendarFull /> : <AgendaScreen /> }
      </View>
      <HoveringBar />
    </Background>
  )
}


const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  notification: {
    backgroundColor:theme.colors.grey,
  }
})