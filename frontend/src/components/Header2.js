import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header2({style, ...props}) {
  return <Text style={[styles.header, style]} {...props} /> //TODO Find correct font
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    color: theme.colors.primary,
    paddingVertical: 12,
  },
})
