import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Subheading } from 'react-native-paper'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import Paragraph from '../../components/Paragraph'
import Dropdown from '../../components/Dropdown'
import Link from '../../components/Link'

export default function RegisterCompanyScreen({ route, navigation }) {

  const next_page = (val) =>
    navigation.navigate('RegisterScreen', {
      teamType: val,
    })
  const teamChoices = [
    {key:"Retailer", value:0, function:() => next_page(0)},
    {key:"Brand", value:1, function:() => next_page(1)},
    {key:"Multi-label Showroom", value:2, function:() => next_page(1)} //TODO fix when adding this feature
  ];

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View style={{marginTop:48}}>
        <Logo/>
      </View>
      <View style={styles.column}>
        <View style={[{flex:1}]}>
          <Header style={{textAlign:'center'}}>Welcome To Gleu</Header>
          <Subheading style={{textAlign:'center'}}>We're so happy you are here</Subheading>
          <Dropdown headerText={'I am a...'} choices ={teamChoices}>
          </Dropdown>
          <Link onPress={() =>  navigation.navigate('RegisterGetCompany')} style={{textAlign:'center', marginTop:12}}>Join an exisiting team</Link>
        </View>
        <View style={[styles.row,{marginBottom:12}]}>
          <Text>Already have an account? </Text>
          <Link onPress={() => navigation.replace('LoginScreen')}>Login</Link>
        </View>
      </View>
    </Background>
  )
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
    justifyContent: 'center'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
