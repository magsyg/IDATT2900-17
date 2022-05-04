import React, {useEffect} from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Subheading, Text } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from '@react-navigation/native';
import { theme } from '../core/theme'
import OutlinedTouch from './OutlinedTouch';

export default function AppointmentsList({ data, mode, ap_type }) {
  const navigation = useNavigation();

  const goToAppointment = item => {
    if (item.appointment_type!=='SR') {
      navigation.navigate('MultiAppointment',{
        screen: 'MultiAppointmentScreen',
        params: {
          appointment_id:item.id
        }});
    } else {
      navigation.navigate('Showroom',{appointment_id:item.id});
    }
  }

  const appointment_colors = {
    'SR':"#fcda71",
    'OT':"#f18a9a",
    'TS':"#7ec98a"
  }

  const filteredData = (data) => {
    if(typeof ap_type === 'undefined' || ap_type =='AL') return data;
    return data.filter(ap => (ap.appointment_type === ap_type))
  }
  function BasicRow(props) {
    return (
      <View key={props.index} style={[styles.row]}>
        <Text style={[styles.col]}>{props.item.start_time.slice(0,5)} - {props.item.end_time.slice(0,5)}</Text>
        <TouchableOpacity style={[styles.row,  {flex:3}]} onPress={() => goToAppointment(props.item)}>
          <Text style={{flex:1, textAlign:'center'}}>{props.item.name}</Text>
          <Text style={{color:theme.colors.grey}}>{props.item.appointment_type}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  function PrettyRow(props) {
    return (
      <View key={props.index} style={[styles.row]}>
        <Icon size={16} name='circle' color={appointment_colors[props.item.appointment_type]}></Icon>
        <Text style={{flex:1, textAlign:'center'}}>{props.item.start_time.slice(0,5)} - {props.item.end_time.slice(0,5)}</Text>

        <OutlinedTouch style={{flex:1, padding:0}} onPress={() => goToAppointment(props.item)}>
          <Text style={styles.buttonText}>{props.item.name}</Text>
        </OutlinedTouch>
      </View>
    )
  }
  function RenderRow(props) {
    switch(mode){
      case('pretty'):
        return <PrettyRow item={props.item} index={props.index}/>
        break;
      case('basic'):
      default:
        return <BasicRow item={props.item} index={props.index}/>
    }
  }
  if (filteredData(data).length > 0) {
    return (

      <FlatList
        data={filteredData(data)}
        numColumns={1}
        scrollEnabled={true}
        renderItem={({item, index}) => 
          <RenderRow item={item} index={index}/>
      }/>
    ) 
  } else {
    return(
    <View style={[styles.row, {justifyContent:'center', padding:4}]}>
      <Subheading style={{color:theme.colors.grey}}>No appointments</Subheading>

    </View>)
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex:1,
    marginBottom:6,
  },
  col: {
    borderWidth:0,
    borderColor:theme.colors.danger
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  text : {},
  buttonText: {
    color:theme.colors.primary, 
    fontSize:14,
    flex:1, 
    textAlign:'center'
  },
})
