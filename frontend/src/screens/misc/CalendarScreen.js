import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import { Subheading, IconButton, Searchbar } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import { theme } from '../../core/theme'

import { Calendar } from 'react-native-calendars';
import AppointmentsList from '../../components/AppointmentList';
import CalendarAppointments from '../../components/CalendarAppointments'

export default function AppointmentCalendarScreen({ route, navigation }) {
  const [meta, setMeta] = useState({'user': {'id':-1}})

  useEffect(() => {
    axios.get('/accounts/current_user/').then((response) => {
      setMeta(response.data)
      console.log(response.data.user)
    }).catch(function (error) {
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
      <CalendarAppointments user={meta.user}/>
    </Background>
  )
}

const styles = StyleSheet.create({
})
