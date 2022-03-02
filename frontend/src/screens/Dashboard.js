import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import { Avatar , DataTable } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Link from '../components/Link'
import PillLink from '../components/PillLink'
import {currentDate} from '../utils/date_management'
import { placeholder } from '../core/placeholders'
import { theme } from '../core/theme'

export default function Dashboard({ navigation }) {
  const today = currentDate()
  const [user, setUser] = useState({ user:'user' })

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

  return (
    <Background>
      <View style = {styles.column}>
        <View style={[styles.row, {flex:1, paddingTop:32}]}>
          <View style={{flex: 3}}>
            <Header style={{fontSize: 25}}>Hi, {user.user}</Header>
          </View>
          <View style={{flex: 1}}>
            <Avatar.Image 
              size={64} 
              source={require('../assets/default_profile.png')}  
            />
          </View>
        </View>
        <View style={{flex:3}}>
          <Header style={{fontSize: 24}}>Notifications</Header> 
          <View>
              <PillLink>
                Message
              </PillLink>
          </View>
        </View>
        <View style={[styles.column, {flex:3}]}>
          <View style={[styles.row, {flex:1, justifyContent: 'space-between'}]}>
              <Header style={{fontSize: 24}}>Today, {today}</Header>
              <View style={{top:16}}>
                <Link>All</Link>
              </View>
          </View>
          <View style={[styles.row,{flex:5}]}>
            <Text style={{flex:2}}>0900-0930</Text>
            <Text style={{flex:2}}>Appointment</Text>
            <Text style={{flex:1}}>SR</Text>
          </View>
        </View>
      </View>
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