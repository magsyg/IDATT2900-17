import React, {useEffect} from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from '@react-navigation/native';
import { theme } from '../core/theme'
import OutlinedTouch from './OutlinedTouch';

export default function AppointmentsList({ data, mode }) {
  const navigation = useNavigation();

  const goToAppointment = item => {
    if (item.appointment_type!=='SR') {
      navigation.navigate('Appointment',{ 
        screen: 'MultiAppointment',
        params: {
          screen: 'MultiAppointmentScreen',
          params:{appointment_id:item.id}
        },
      });
    } else {
      navigation.navigate('Appointment',{ 
        screen: 'Showroom',
        params: {
          screen: 'ShowroomScreen',
          params:{appointment_id:item.id}
        },
      });
    }
  }

  const appointment_colors = {
    'SR':"#fcda71",
    'OT':"#f18a9a",
    'TS':"#7ec98a"
  }
  function BasicRow(props) {
    return (
      <View key={props.index} style={[styles.row]}>
        <Text style={[styles.col]}>{props.item.time.slice(0,5)} - {props.item.time.slice(0,5)}</Text>
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
        <Text style={{flex:1, textAlign:'center'}}>{props.item.time.slice(0,5)} - {props.item.time.slice(0,5)}</Text>

        <OutlinedTouch style={{flex:1, padding:0}} onPress={() => goToAppointment(props.item)}>
          <Text style={{flex:1, textAlign:'center'}}>{props.item.name}</Text>
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
  return (
    <FlatList
      data={data}
      numColumns={1}
      scrollEnabled={true}
      renderItem={({item, index}) => 
        <RenderRow item={item} index={index}/>
     }/>
  )
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
  text : {}
})
