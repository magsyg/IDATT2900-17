import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading, Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function HeaderWithSub({containerStyle, header, subheader}) {

  return <View style={containerStyle}>
          <Text style ={styles.header}>{header}</Text>
          <Subheading style={styles.subheader}>{subheader}</Subheading>
  </View>
}

const styles = StyleSheet.create({
  header: {
    fontSize: 31,
    color: theme.colors.primary,
    paddingTop: 12,
    textAlign:'center', 
    paddingBottom:0
  },
  subheader: {
    textAlign:'center', 
    color:theme.colors.grey 
  }
})
