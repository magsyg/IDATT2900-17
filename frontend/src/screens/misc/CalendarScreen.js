import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import { Subheading, IconButton, Searchbar } from 'react-native-paper'
import Header from '../../components/Header'
import { theme } from '../../core/theme'

import { Calendar } from 'react-native-calendars';
import AppointmentsList from '../../components/AppointmentList';
import CalendarAppointments from '../../components/CalendarAppointments'
import CurrentUserContext from '../../../Context'
import BackgroundAuth from '../../components/BackgroundAuth'
import MapMini from '../../components/MapMini.js'

export default function AppointmentCalendarScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);


  return (
    <View>
      <BackgroundAuth>
        {!authIsLoading &&
          <CalendarAppointments user={currentUser.user}/>
        }
      </BackgroundAuth>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('FullMap')}>
          <MapMini />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
})
