import React, { useState, useEffect } from 'react'
import axios from 'axios'
import filter from 'lodash.filter';
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import { Avatar, Subheading, IconButton, Searchbar } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import { theme } from '../core/theme'

import { Calendar } from 'react-native-calendars';

export default function AppointmentCalendarScreen({ route, navigation }) {
  const [meta, setMeta] = useState({'user': {}})

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
  }, []);

  return (
    <Background>
      <Modal visible={monthVisible} onDismiss={hideMonthModal} style={{paddingTop:64}}>
        <FlatList 
            style={{paddingTop:64}}
            data={monthNames}
            numColumns={1}
            scrollEnabled={false}
            renderItem={({item, index}) => 
              <TouchableOpacity key={index} style={{marginBottom:0}} onPress={() => selectMonth(index)}>
                  <Text style={[styles.monthSelectStyle, index === month && {color:theme.colors.secondary}]}>{item}</Text>
              </TouchableOpacity>
            }/>
      </Modal>
      <View style={[styles.column,{marginTop:16}]}>
        <TouchableOpacity onPress={showMonthModal}>
          <Header>{monthNames[month]}</Header>
        </TouchableOpacity>
        <Calendar
         />
      </View>
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
    justifyContent: 'center'
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
