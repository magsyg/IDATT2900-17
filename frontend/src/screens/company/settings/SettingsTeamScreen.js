import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native'
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
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'
import BackHeader from '../../../components/BackHeader'
import Header2 from '../../../components/Header2'


export default function SettingsTeamScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  const goToProfile = id => {
    navigation.navigate('Members', {screen:'CompanyMember', params:{profile_id:id}});
  }

  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <BackHeader goBack={navigation.goBack}>
          <Subheading style={{color:theme.colors.grey}}>
            Manage Team
          </Subheading>
            <CompanyLogo
                  size={48} 
                  company={currentUser.company}  
            />
        </BackHeader>
        <View style={styles.column}>
          <View style={styles.buttonRow}>
            <Header>Members</Header>
            <IconButton icon='plus' size={32} color={theme.colors.secondary}  onPress={() => navigation.navigate('SettingsTeamCodeScreen')}/>
          </View>
          <View style={{flex:2}}>
            <FlatList
                data={currentUser.company.members}
                numColumns={1}
                renderItem={({item, index}) => 
                <TouchableOpacity key={index} onPress={() => goToProfile(item.id)} style={styles.userRow}>    
                    <Subheading>{item.first_name} {item.last_name}</Subheading>
                    <ProfilePicture size={40} user={item}/>
                </TouchableOpacity>
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
      </BackgroundAuth>
    ) 
  } else {
    return (<BackgroundAuth/>)
  }
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
  userRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:8,
    borderBottomWidth:1,
    borderBottomColor:theme.colors.lightgrey, 
    padding:6
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
