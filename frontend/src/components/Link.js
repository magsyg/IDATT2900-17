import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'

export default function PillLink({children}) {
  return (
    <TouchableOpacity>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    link: {
        fontSize: 13,
        color: theme.colors.link,
    },
})