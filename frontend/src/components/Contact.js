import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { theme } from '../core/theme'
import OutlinedButton from './OutlinedButton'
import ProfilePicture from './ProfilePicture'

export default function Contact({user,contactType}) {
  return (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <ProfilePicture 
          size={72} 
          user={user}
        />
      </View>
      <View style={{flex:3}}>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text> 
        <Text style={styles.contactType}>{contactType}</Text> 
        <OutlinedButton labelStyle={{fontSize:16}}> {user.phone_number}</OutlinedButton>
        <OutlinedButton>{user.email}</OutlinedButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 4,
  },
  name : {
    textAlign:'center',
  },
  contactType: {
    textAlign:'center',
    color:theme.colors.grey,
    fontStyle: 'italic'
  },
  buttonText: {
    color:theme.colors.primary, 
    fontSize:12
  },
  buttonStyle: {
    borderRadius:25, 
    marginVertical:8, 
  }
})