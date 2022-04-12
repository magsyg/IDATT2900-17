import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function OutlinedTouch({onPress, children }) {
  return (
    <TouchableOpacity style={[styles.buttonStyle]}onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color:theme.colors.primary, 
    fontSize:11
  },
  buttonStyle: {
    borderRadius:25, 
    borderWidth:1,
    borderColor: theme.colors.grey,
    flex:1,
    paddingVertical:2

  }
})
