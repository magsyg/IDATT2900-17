import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header({style, ...props}) {
  return <Text style={[styles.header, style]} {...props} /> //TODO Find correct font
}

const styles = StyleSheet.create({
  header: {
    fontSize: 31,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})
