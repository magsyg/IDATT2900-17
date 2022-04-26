import React, { useState, useEffect } from 'react'

import { View, StyleSheet, FlatList } from 'react-native'
import {  Text, Subheading, IconButton } from 'react-native-paper'
import Background from '../../../components/Background'
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import Paragraph from '../../../components/Paragraph'
import ProfilePicture from '../../../components/ProfilePicture'
import BackgroundAuth from '../../../components/BackgroundAuth'
import CurrentUserContext from '../../../../Context'
import api from '../../../../api'

export default function SettingsTeamCodeScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  const [company, setCompany] = useState({name:'Company', codes: []})
  const [user, setUser] = useState({name: 'User' })
  useEffect(() => {
      // Fetches details about user
      api.get('/accounts/current_user/').then((response) => {
        setUser(response.data.user);
      })  .catch(function (error) {
        
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
        
      });
    // Fetches details about company and the codes
    api.get('/companies/company/codes/').then((response) => {
      setCompany({
        name: response.data.name,
        codes: response.data.codes
      })
    })  .catch(function (error) {
      
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
      
    });
  }, []);

  const onNewCodePressed = () => {
    api.post('/companies/company/codes/').then((response) => {
      setCompany({
        name: response.data.name,
        codes: response.data.codes
      })
    })  .catch(function (error) {
      
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
      
    });
  }
  const onDeleteCodePressed = code => {
    const payload = {
      code: code
    }
    api.delete('/companies/company/codes/', {data:payload}).then((response) => {
      setCompany({
        name: response.data.name,
        codes: response.data.codes
      })
    })  .catch(function (error) {
      
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
      
    });
  }
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <BackButton goBack={() => navigation.navigate('SettingsTeamScreen')} />
        <View style={styles.column}>
          <View style={[{flex:1,  marginVertical:16}]}>
            <View style={[styles.row, {margin:4}]}>
              <Header>
                Manage Codes
              </Header>
            </View>
            <View style={styles.row}>
              <ProfilePicture 
                size={80} 
                user={user}
              />
            </View>
            <View style={[styles.row, {margin:4}]}>
              <Subheading style={{color:theme.colors.secondary}}>
                  {company.name}
              </Subheading>
            </View>
          </View>
          <View style={[styles.buttonRow,{marginTop:32}]}>
            <Header>Activation codes</Header>
            <IconButton icon='plus' color={theme.colors.secondary} onPress={onNewCodePressed}/>
          </View>
          <View style={{flex:2}}>
            <FlatList
                data={company.codes}
                numColumns={1}
                contentContainerStyle={{marginHorizontal:16}}
                renderItem={({item, index}) => 
                <View key={index} style={[styles.buttonRow, styles.codeRow]}>
                  <Text style={styles.text}>{item}</Text>
                  <IconButton icon='delete' color={theme.colors.error} onPress={ () => onDeleteCodePressed(item)}/>
                </View>
                }                             
            />
          </View>
          <View style={{flex:1,marginTop:16}}>
              <Paragraph style={{color:theme.colors.grey}}>
                Here you can manage activation codes,
                send an activation code to members of your company
                which is to be used on registration
                codes will be deleted after use
              </Paragraph>
          </View>
        </View>
      </BackgroundAuth>
    ) 
  } else {
    return (
      <BackgroundAuth/>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
    alignSelf: 'stretch',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:4,
    alignSelf: 'stretch',
    
  },
  codeRow: {
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
  },
  column: {
    flex: 2,
    width:'100%',
    flexDirection: "column",
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
