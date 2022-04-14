import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'

export default function PillLink({onPress, style, labelStyle, mode, children}) {
  return (
    <TouchableOpacity style={[styles.button, style, mode === 'highlight' && {backgroundColor:theme.colors.secondary}]} onPress={onPress}>
      <Text style={[styles.text, labelStyle, mode === 'highlight' && {color:theme.colors.white}]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius:15,
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal:2,
    backgroundColor:theme.colors.lightgrey
  },
  text: {
    textAlign:'center',
    fontSize: 14,
    color:theme.colors.primary,
  },
})