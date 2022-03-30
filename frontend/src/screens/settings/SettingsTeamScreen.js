import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, FlatList } from 'react-native'
import { Avatar, Text, Subheading, IconButton } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import OptionIconLink from '../../components/OptionIconLink'
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'

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
            <Avatar.Image 
                  size={80} 
                  source={require('../../assets/default_profile.png')}  
            />
          </View>
          <View style={[styles.row, {margin:4}]}>
            <Subheading style={{color:theme.colors.primary}}>
              {user.name}
            </Subheading>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Header>Users</Header>
          <IconButton icon='plus'/>
        </View>
        <View style={{flex:1}}>
          <FlatList
              data={company.members}
              numColumns={1}
              contentContainerStyle={{marginHorizontal:16}}
              renderItem={({item, index}) => 
              <OptionIconLink text={item.first_name + " "+ item.last_name}>            
                <Avatar.Image size={32} source={require('../../assets/default_profile.png')}/>
              </OptionIconLink>
              }                             
          />
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
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})