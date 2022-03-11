import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'

export default function PillLink({onPress, style, children}) {
  return (
    <TouchableOpacity>
      <Text onPress={onPress} style={[styles.link, style]}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    link: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
})