import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function OutlinedButton({style, labelStyle, ...props }) {
  return (
    <PaperButton
      style={[
        styles.buttonStyle,
        style,
      ]}
      labelStyle={[styles.buttonText, {color:theme.colors.primary}, labelStyle]}
      mode='outlined'
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color:theme.colors.primary, 
    fontSize:11
  },
  buttonStyle: {
    borderRadius:25, 
    marginVertical:8, 
  }
})
