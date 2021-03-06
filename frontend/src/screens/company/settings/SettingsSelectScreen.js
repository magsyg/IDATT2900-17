import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Subheading } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import BackgroundAuth from '../../../components/BackgroundAuth';
import CurrentUserContext from '../../../../Context';
import Link from '../../../components/Link';

export default function SettingsSelectScreen({ route, navigation }) {
  const { currentUser, authIsLoading, handleLogout } = React.useContext(CurrentUserContext);
  if (!authIsLoading && currentUser !== null) {
  return (
    <BackgroundAuth>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.column}>
        <View style={[styles.row, {flex:1,  marginTop:32}]}>
          <Header>Settings</Header>
        </View>
        <View style={[{flex:5}]}>
          <View style={styles.row}></View>
          <OptionIconLink onPress={() => navigation.navigate('SettingsProfileScreen')} text="My Profile"><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
          <OptionIconLink onPress={() => navigation.navigate('SettingsTeamScreen')} text="Company Members"><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
          <OptionIconLink onPress={() => navigation.navigate('SettingsCompanyScreen')} text="Company Settings"><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink>
          { currentUser.company_type == 'BRAND' && <OptionIconLink onPress={() => navigation.navigate('SettingsShowroom')} text="Showroom Settings"><Icon name='keyboard-arrow-right' size={30} color={theme.colors.grey}/></OptionIconLink> }
        </View>
        <View>
          <TouchableOpacity onPress={handleLogout}>
            <Text  style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundAuth>
  ) 
  } else {
    return(<BackgroundAuth/>)
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  logout: {
    color:theme.colors.danger,
    textAlign:'center',
    padding:32,
    fontSize:20,
  }
})
