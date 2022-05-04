import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList, Dimensions } from 'react-native'
import { Subheading, IconButton, Searchbar } from 'react-native-paper'
import Header from '../../components/Header'
import { theme } from '../../core/theme'

import { Calendar } from 'react-native-calendars';
import AppointmentsList from '../../components/AppointmentList';
import CalendarAppointments from '../../components/CalendarAppointments'
import CurrentUserContext from '../../../Context'
import BackgroundAuth from '../../components/BackgroundAuth'
import MapView from 'react-native-maps'

export default function AppointmentCalendarScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);


  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <CalendarAppointments user={currentUser.user}/>
        <MapView style={ styles.map } />
      </BackgroundAuth>
    )
  } else {
    return (<BackgroundAuth/>);
  }
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').height * 0.4,
  }
})
