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
  const [user, setUser] = useState({name: 'User' })
  const [company, setCompany] = useState({name:'Company', members: []})
  useEffect(() => {
    // Fetches details about user
    axios.get('/accounts/current_user/').then((response) => {
      setUser({name: response.data.first_name+ " "+response.data.last_name})
    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log("-----axios----")
    });
    // Fetches details about company
    axios.get('/companies/user/company/').then((response) => {
      setCompany({
        name: response.data.name,
        members: response.data.members
      })
    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log("-----axios----")
    });
  }, []);

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.column}>
        <View style={[{flex:1,  marginVertical:16}]}>
          <View style={styles.row}>
            <Header>Manage Users</Header>
          </View>
          <View style={styles.row}>
            <CompanyLogo
                size={64} 
                company={company}  
            />
          </View>
          <View style={[styles.row, {margin:4}]}>
            <Subheading style={{color:theme.colors.secondary}}>
              {company.name}
            </Subheading>
          </View>
        </View>
        <View style={[styles.buttonRow,{marginTop:32}]}>
          <Header>Users</Header>
          <IconButton icon='plus' color={theme.colors.secondary}  onPress={() => navigation.navigate('SettingsTeamCodeScreen')}/>
        </View>
        <View style={{flex:2}}>
          <FlatList
              data={company.members}
              numColumns={1}
              contentContainerStyle={{marginHorizontal:16}}
              renderItem={({item, index}) => 
              <OptionIconLink key={index}  text={item.first_name + " "+ item.last_name}>        
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
    </Background>
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
