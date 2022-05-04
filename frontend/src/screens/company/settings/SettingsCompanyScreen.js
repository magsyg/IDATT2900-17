import React, { useState, useEffect } from 'react'
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
import TextInput from '../../../components/TextInput'
import Button from '../../../components/Button'
import BackgroundAuth from '../../../components/BackgroundAuth'
import CurrentUserContext from '../../../../Context'
import api from '../../../../api'

export default function SettingsCompanyScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const [user, setUser] = useState({name: 'User' })
  const [company, setCompany] = useState({name:'Company', members: []})
  const [bio, setBio] = useState({ value: '', error: '' })
  const [homePage, setHomePage] = useState({ value: '', error: '' })
  useEffect(() => {
    // Fetches details about user
    api.get('/accounts/current_user/').then((response) => {
      setUser(response.data.user);
      setCompany(response.data.company);
      setBio({value:response.data.company.bio, error:''});
      setHomePage({value:response.data.company.homepage, error:''});

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

  const onUpdatePressed = () => {
    const payload = {
    }
    if (bio.value !== company.bio) payload['bio'] = bio.value;
    if (homePage.value !== company.homepage) payload['homepage'] = homePage.value;
    console.log(payload)
    api.post('/companies/update/', payload).then((response) => {
      setCompany(response.data);
      setBio({value:response.data.bio, error:''});
      setHomePage({value:response.data.homepage, error:''});

    }).catch(function (error) {
      
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.hasOwnProperty("bio")) {
          setBio({error: error.response.data.bio[0]})
        }
        if (error.response.data.hasOwnProperty("homepage")) {
          setHomePage({error: error.response.data.homepage[0]})
        }
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
        <BackButton goBack={navigation.goBack} />
        <View style={styles.column}>
          <View style={[{flex:1,  marginVertical:16}]}>
            <View style={styles.row}>
              <Header>Edit Company</Header>
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
          
          <View style={{flex:3, marginTop:16}}>
            <View style={styles.row}>  
              <TextInput
                label="Homepage URL"
                returnKeyType="next"
                value={homePage.value}
                onChangeText={(text) => setHomePage({ value: text, error: '' })}
                error={!!homePage.error}
                errorText={homePage.error}
              />
            </View>
            <View style={styles.row}>  
              <TextInput
                label="Company Description"
                returnKeyType="next"
                multiline
                value={bio.value}
                onChangeText={(text) => setBio({ value: text, error: '' })}
                error={!!bio.error}
                errorText={bio.error}
              />
            </View>
          </View>
          <View style={[styles.row,{marginBottom:16}]}>  
            <Button
              mode="contained"
              style={styles.button}
              onPress={onUpdatePressed}
            >
              Update Company
            </Button>
          </View>
        </View>
      </BackgroundAuth>
    )
  } else {
    return(
      <BackgroundAuth/>
    )
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
  column: {
    flex: 1,
    flexDirection: "column",
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
})
