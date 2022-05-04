import React, { useState, useEffect } from 'react'

import { View, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { Text, Subheading, Badge } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import BackHeader from '../../../components/BackHeader'
import AppointmentInfo from '../../../components/AppointmentInfo'
import OutlinedButton from '../../../components/OutlinedButton'
import LocationInfo from '../../../components/LocationInfo'
import Header2 from '../../../components/Header2'
import { FlatList } from 'react-native-gesture-handler'
import OutlinedTouch from '../../../components/OutlinedTouch'
import Paragraph from '../../../components/Paragraph'
import PillLink from '../../../components/PillLink'
import Button from '../../../components/Button'
import HeaderWithSub from '../../../components/HeaderWithSub'
import Note from '../../../components/Note'
import TeamSelect from '../../../components/TeamSelect'
import CompanyLogo from '../../../components/CompanyLogo'
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'
import api from '../../../../api';

export default function NewContactBrandScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  // Should probably be moved
  const {brand_id, passed_team } = route.params
  const [brand, setBrand] = useState({'name':"BRAND NAME", "members":[], "bio":"COMPANY BIO","homepage":"www.gleu.app"});
  const [successModal, setSuccessmodal] = useState(false);

  // TEAM
  const [team, setTeam] = useState([])
  const manageTeam = teamMember => {
    var added = team;
    if (teamMember.id != -1) {
      added.push(teamMember)
      added = added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => ar.id !== currentUser.user.id);
    }
    setTeam(added)
  }
  const removeTeam = teamMember => {
    let added = team.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => (ar.id !== currentUser.user.id && ar.id !== teamMember.id));
    setTeam(added)
  }

  // Return to create appointment
  const toBrandSearch = () => {
    navigation.navigate('AppointmentCreate',{
        screen: 'AppointmentCreateShowroomSearchScreen',
        params: {passed_team:team}
      });
  }
  useEffect(() => {
    setSuccessmodal(false);
    api.get(`/companies/brand/${brand_id}/profile/`).then((response) => {
      setBrand(response.data.brand)
      console.log(response.data.brand.current_showroom)
      setAppointments(response.data.appointments)
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
  }, [brand_id]);

  useEffect(() => {
    if (typeof passed_team !== 'undefined') setTeam(passed_team);
  }, [passed_team]);


  const requestAppointment = () => {
    const payload = {
      'retailer': {'retailer': currentUser.company.id, 'organizer': currentUser.user.id},
      'appointment': {
        'appointment_type': 'SR',
        'is_request':true,
        'name':'Showroom Request',
        'other_information':null,
        'date':null,
        'start_time':null,
        'end_time':null
      },
      'brands': [{
        'brand': brand.id,
      }]
    }
    // Checks if there is an team for this appointment
    if (team.length > 0) payload['retailer']['retailer_participants'] =  team.map(x => x.id);
    
    api.post('/appointments/create/', payload).then((response) => {
      setSuccessmodal(true);
    }).catch(function (error) {
      
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      
    });
  }

  const nextScreen = () => {
    setSuccessmodal(false);
    toBrandSearch(); //TODO set this to a better
  }

  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <Modal visible={successModal}>
          <TouchableOpacity  style={{flex:1}} onPress={nextScreen}>
            <View style={[styles.row, {margin:32,justifyContent:'flex-end'}]}> 
              <CompanyLogo
                  size={64} 
                  company={brand}  
              />
            </View>
          <View style={{padding:64}}>
            <Header style={{textAlign:'center'}}>{brand.name}</Header>
            <Paragraph style={{textAlign:'center', color:theme.colors.grey}}>
              Showroom appointment has been requested. Check your notifications for updates.
            </Paragraph>
          </View>
          </TouchableOpacity>
        </Modal>
        <View style= {styles.column}>
          <View style={styles.row}> 
            <BackHeader goBack={toBrandSearch}>  
              <CompanyLogo
                  size={64} 
                  company={brand}  
              />
            </BackHeader>
          </View>
          <HeaderWithSub header={brand.name} subheader={'Showroom Appointment Request'}/>
          <View style={{marginVertical:32, justifyContent:'flex-start'}}>
            <Header2>Company Profile</Header2>
            <Paragraph>{brand.bio}</Paragraph>
            <PillLink>{brand.homepage}</PillLink>
          </View>  
          <View style={[styles.row, {marginTop:16}]}>
            <OutlinedButton style={{flex:1, marginEnd:6}} labelStyle={{fontSize:14}}>Lookbook</OutlinedButton>
            <OutlinedButton style={{flex:1, marginStart:6}} labelStyle={{fontSize:14}}>Line Sheet</OutlinedButton>
          </View>
          <View style={{marginVertical:16}}>
            <TeamSelect 
              containerStyle={{marginVertical:16}}
              company={currentUser.company} 
              selectedUsers={team} 
              main_user={currentUser.user}
              addMethod={manageTeam}
              removeMethod={removeTeam}
              start={true}
            />
          </View> 
          <Note containerStyle={{marginVertical:16}} company={brand}/>
          <View>
            <Button onPress={requestAppointment}>Request Appointment</Button>
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
  appointmentButton: {
    padding:24,
    marginBottom:8,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  appointmentButtonText: {
    fontSize:16,
    marginVertical:4,
  }
})
