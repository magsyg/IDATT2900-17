import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'
import { transformNiceDate } from '../utils/date_management'
import LocationInfo from './LocationInfo'
import OutlinedButton from './OutlinedButton'
export default function AppointmentInfo({containerStyle, appointment}) {

  return (
    <View style={containerStyle}>
        <View style={[styles.row, {marginTop:16, justifyContent:'space-between', paddingHorizontal:32}]}>
          <Text>{appointment.start_time.slice(0,5)} - {appointment.end_time.slice(0,5)}</Text>
          <Text>{transformNiceDate(appointment.date)}</Text>
        </View>
        {appointment.appointment_type === 'SR' &&
          <LocationInfo item={appointment.brands[0].brand.current_showroom}/>
        }
        <View style={{marginTop:16}}>
          {appointment.appointment_type === 'TR' && <OutlinedButton  style={{borderRadius:25, marginVertical:8}} labelStyle={{color:theme.colors.primary}} color={theme.colors.grey} mode="outlined"> Pass </OutlinedButton> }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 4,
  },
  name : {
    textAlign:'center',
  },
  contactType: {
    textAlign:'center',
    color:theme.colors.grey,
    fontStyle: 'italic'
  },
  buttonText: {
    color:theme.colors.primary, 
    fontSize:12
  },
  buttonStyle: {
    borderRadius:25, 
    marginVertical:8, 
  }
})