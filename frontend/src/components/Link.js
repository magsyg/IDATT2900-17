import React from 'react'
import { StyleSheet, TouchableOpacity, Text, TouchableHighlight } from 'react-native'
import { theme } from '../core/theme'

export default function Link({onPress, style, children}) {
  return (
    <TouchableHighlight>
      <Text onPress={onPress} style={[styles.link, style]}>{children}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    link: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
})