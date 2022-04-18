import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import { Subheading, IconButton, Searchbar } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import { theme } from '../core/theme'

import { Calendar } from 'react-native-calendars';
import AppointmentsList from '../components/AppointmentList';
import CalendarAppointments from '../components/CalendarAppointments'

export default function AppointmentCalendarScreen({ route, navigation }) {
  const [meta, setMeta] = useState({'user': {}})
  const [appointments, setAppointments] =useState([])
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().substring(0, 10))
  // Month
  const [month, setMonth] = useState(0);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const [monthVisible, setMonthVisible] = useState(false);
  const showMonthModal = () => setMonthVisible(true);
  const hideMonthModal = () => setMonthVisible(false);

  const selectMonth = (value) => {
    setMonth(value);
    hideMonthModal();
  }

  useEffect(() => {
    console.log(currentDate)
    const current_date = new Date();
    setMonth(current_date.getMonth());
    axios.get('/accounts/calendar/').then((response) => {
      setMeta(response.data)
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
    axios.get('/appointments/user/').then((response) => {
      setAppointments(response.data)
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

  const selectDay = (dateString) => {
    setCurrentDate(dateString);
    axios.get(`/appointments/user/?date=${dateString}`).then((response) => {
      setAppointments(response.data)
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
  }

  return (
    <Background>
      <CalendarAppointments user={meta.user}/>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
  monthSelectStyle: {
    textAlign:'center', 
    fontSize:32
  }
})
