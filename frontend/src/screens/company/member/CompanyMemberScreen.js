import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, FlatList} from 'react-native'
import { Text, Subheading, Searchbar, IconButton } from 'react-native-paper'
import * as Clipboard from 'expo-clipboard';
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import PillLink from '../../../components/Link';
import OutlinedButton from '../../../components/OutlinedButton'
import OutlinedTouch from '../../../components/OutlinedTouch'
import AppointmentsList from '../../../components/AppointmentList'
import ProfilePicture from '../../../components/ProfilePicture'
import CalendarAppointments from '../../../components/CalendarAppointments'
import BackgroundAuth from '../../../components/BackgroundAuth'
import CurrentUserContext from '../../../../Context'
import api from '../../../../api';

export default function CompanyMemberScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  const {profile_id} = route.params
  const [profile, setProfile] = useState({'first_name':'First Name', 'last_name':'Last Name','phone_number':'3333 6666', 'email':'email@email.com'});
  const [appointments, setAppointments] = useState([])
  
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  
  useEffect(() => {
    api.get(`/accounts/profile/${profile_id}/`).then((response) => {
      setProfile(response.data)
    }).catch(function (error) {
      
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
    api.get(`/appointments/users/${profile_id}/`).then((response) => {
      setAppointments(response.data)
    }).catch(function (error) {
      
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
  }, [profile_id]);

  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'flex-end', marginTop:24, marginBottom:0}]}>
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={navigation.goBack}></IconButton>
          </View>
          <View style={styles.row}>
            <ProfilePicture 
                size={96} 
                user={profile}
            />
          </View>
          <Header style={{textAlign:'center'}}>{profile.first_name} {profile.last_name}</Header>

          <OutlinedTouch style={{marginTop:12}} onPress={copyToClipboard(profile.email)}>
              <Text style={styles.outlinedTouchText}>
                {profile.email}
              </Text>
            </OutlinedTouch>
          <OutlinedTouch style={{marginTop:12}} labelStyle={{margin:6, fontSize:14}} onPress={copyToClipboard(profile.phone_number)}>
            <Text style={styles.outlinedTouchText}>
              {profile.phone_number}
            </Text>
          </OutlinedTouch>

          <View style={{margin:16, marginTop:32}}>
            <CalendarAppointments user={profile}/>
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
    alignItems:'center',
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
  border: {
    borderWidth:1,
    borderColor:theme.colors.primary
  },
  outlinedTouchText: {
    margin:6,
    color:theme.colors.primary, 
    fontSize:14,
    flex:1, 
    textAlign:'center'
  }
})
