import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'
import { transformNiceDate } from '../utils/date_management'
import OutlinedButton from './OutlinedButton'
export default function LocationInfo({containerStyle, item, only_address}) {

  if (typeof item !== "undefined") {
  return (
    <View style={containerStyle}>
        {(item.address != null && item.city != null) && 
        <View style={{marginTop:16}}>
          <OutlinedButton style={{borderRadius:25, marginVertical:8}} labelStyle={{color:theme.colors.primary}} color={theme.colors.grey} mode="outlined">{item.address} {item.city}</OutlinedButton>
        </View>
        }
        {!only_address &&
        <View style={[styles.row, {marginTop:16, justifyContent:'space-between', paddingHorizontal:32}]}>
          {(item.doorcode != null && item.doorcode.length > 0) && <Text>Door Code: {item.doorcode}</Text> }
          {(item.floor != null && item.floor.length > 0) && <Text>Floor: {item.floor}</Text> }
        </View>
        }
    </View>
    )
  }
  else {
    return(<View></View>)
  }
}
//TODO add check for door, address and floor
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