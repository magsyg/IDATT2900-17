import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading, Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Availabilty({data}) {
  return (
    <View>
      <Subheading style={styles.header}>AVAILABILITY</Subheading>
    </View>
    
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: theme.colors.text,
    paddingVertical: 12,
    textAlign:'center'
  },
})
