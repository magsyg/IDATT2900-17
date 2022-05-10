import React, {useState, useEffect} from 'react'
import { StyleSheet, View, TouchableOpacity, Text, FlatList,  Modal,ScrollView } from 'react-native'
import { IconButton, Subheading } from 'react-native-paper'
import { theme } from '../core/theme'
import ProfileModal from './ProfileModal'



export default function UserRow({containerStyle, users}) {

  return <View>
      <ScrollView nestedScrollEnabled = {true} horizontal={true} contentContainerStyle={[{flex: 1, justifyContent:'flex-start'}, containerStyle]}>
          {
          users.map((item, index) => {
              return(
                <ProfileModal key={index} user={item} />
              );     
            })
          }
      </ScrollView>
    </View>
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom:8,
    padding:4, 
  },
})