import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function OutlinedTouch({style, labelStyle, onPress, children }) {
  return (
    <TouchableOpacity style={[styles.buttonStyle, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color:theme.colors.primary, 
    fontSize:14,
    flex:1, 
    textAlign:'center'
  },
  buttonStyle: {
    borderRadius:25, 
    borderWidth:1,
    borderColor: theme.colors.grey,
    flex:1,
    paddingVertical:2

  }
})
