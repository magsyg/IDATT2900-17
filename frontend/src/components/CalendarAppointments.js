import React, { useState, useEffect, Fragment, useCallback, useMemo } from 'react';
import axios from 'axios';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, Modal } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';
import Background from './Background';
import Header from './Header';
import AppointmentsList from './AppointmentList.js';
import { theme } from '../core/theme';
import Header2 from './Header2';

export default function CalendarAppointments({ user, currentUser }) {
  const [appointments, setAppointments] =useState([])
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().substring(0, 10))
  // Month
  const [month, setMonth] = useState((new Date()).getMonth());
  const [monthDate, setMonthDate] = useState(new Date());
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  const [monthVisible, setMonthVisible] = useState(false);
  const showMonthModal = () => setMonthVisible(true);
  const hideMonthModal = () => setMonthVisible(false);

  const selectMonth = useCallback(value => {
    setMonth(value);
    let date = new Date();
    date.setMonth(value);
    date.setDate(1);
    setMonthDate(date);
    if (date.getMonth() === (new Date()).getMonth()) {
      setCurrentDate(new Date().toISOString().substring(0, 10))
    } else {
      setCurrentDate(date.toISOString().substring(0, 10))
    }
    hideMonthModal();
  })

  const onDayPress = useCallback(day => {
    setCurrentDate(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [currentDate]: {
        selected: true,
        disableTouchEvent: true,
      }
    };
  }, [currentDate]);



  useEffect(() => {
    axios.get(`/appointments/user/?date=${currentDate}`).then((response) => {
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
  }, [currentDate, user]);

  return (
    <View style={{flex:1, width:'100%'}}>
      <Modal visible={monthVisible} onDismiss={hideMonthModal} style={{paddingTop:64}}>
        <FlatList 
            style={{paddingTop:64}}
            data={monthNames}
            numColumns={1}
            scrollEnabled={false}
            renderItem={({item, index}) => 
              <TouchableOpacity key={index} style={{marginBottom:0}} onPress={() => selectMonth(index)}>
                  <Header2 style={[styles.monthSelectStyle, index === month && {color:theme.colors.secondary}]}>{item}</Header2>
              </TouchableOpacity>
            }/>
      </Modal>
      <View style={[styles.column,{marginTop:16}]}>
        <TouchableOpacity onPress={showMonthModal}>
          <Header style={{textAlign:'center'}}>{monthNames[month]}</Header>
        </TouchableOpacity>
        <Calendar 
          current={monthDate}
          key={monthDate}
          onDayPress={onDayPress}
          markingType={'multi-dot'}
          markedDates={marked}
          renderHeader={date => {}}
          hideArrows
        />
        <AppointmentsList mode='pretty' data={appointments}/>
      </View>
    </View>
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
  monthSelectStyle: {
    textAlign:'center', 
    fontSize:32,
    paddingVertical:2
  }
});