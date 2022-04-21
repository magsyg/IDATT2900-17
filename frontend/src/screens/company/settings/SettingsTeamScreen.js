import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, FlatList } from 'react-native'
import { Avatar, Text, Subheading, IconButton } from 'react-native-paper'
import Background from '../../../components/Background'
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import Paragraph from '../../../components/Paragraph'
import ProfilePicture from '../../../components/ProfilePicture'
import CompanyLogo from '../../../components/CompanyLogo'

export default function SettingsTeamScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  const goToProfile = id => {
    navigation.navigate('ProfileScreen', {profile_id:id});
  }

  return (
    <BackgroundAuth>
      <BackButton goBack={navigation.goBack} />
      {!authIsLoading && 
      <View style={styles.column}>
        <View style={[{flex:1,  marginVertical:16}]}>
          <View style={styles.row}>
            <Header>Manage Users</Header>
          </View>
          <View style={styles.row}>
            <CompanyLogo
                size={64} 
                company={currentUser.company}  
            />
          </View>
          <View style={[styles.row, {margin:4}]}>
            <Subheading style={{color:theme.colors.secondary}}>
              {currentUser.company.name}
            </Subheading>
          </View>
        </View>
        <View style={[styles.buttonRow,{marginTop:32}]}>
          <Header>Users</Header>
          <IconButton icon='plus' color={theme.colors.secondary}  onPress={() => navigation.navigate('SettingsTeamCodeScreen')}/>
        </View>
        <View style={{flex:2}}>
          <FlatList
              data={currentUser.company.members}
              numColumns={1}
              contentContainerStyle={{marginHorizontal:16}}
              renderItem={({item, index}) => 
              <OptionIconLink key={index}  text={item.first_name + " "+ item.last_name} onPress={() => goToProfile(item.id)}>        
                <ProfilePicture size={32} user={item}/>
              </OptionIconLink>
              }                             
          />
        </View>
        <View style={{flex:1, marginTop:16}}>
            <Paragraph style={{color:theme.colors.grey}}>
              Here you can view members of the team,
              press the + button to view activation codes you can send to new members
            </Paragraph>
        </View>
      </View>
      }
    </BackgroundAuth>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:4
  },
  column: {
    flex: 1,
    flexDirection: "column",
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
