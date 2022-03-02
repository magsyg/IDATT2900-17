import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'

export default function PillLink({children}) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius:10,
    marginVertical: 5,
    paddingVertical: 8,
    paddingHorizontal:12,
    backgroundColor:theme.colors.grey
  },
  text: {
    fontSize: 14,
    color:theme.colors.primary,
  },
})