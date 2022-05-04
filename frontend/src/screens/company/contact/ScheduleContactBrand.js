import React, { useState, useEffect } from 'react'

import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
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
import TeamSelect from '../../../components/TeamSelect'
import HeaderWithSub from '../../../components/HeaderWithSub'
import Availabilty from '../../../components/Availability'
import DurationModal from '../../../components/DurationModal'
import Contact from '../../../components/Contact'
import CompanyLogo from '../../../components/CompanyLogo'
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'
import api from '../../../../api';

export default function ScheduleContactBrandScreen({ route, navigation }) {
  const {brand_id} = route.params
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);

  const [brand, setBrand] = useState({'name':"BRAND NAME", "members":[], "bio":"COMPANY BIO","homepage":"www.gleu.app"});
  const [appointments, setAppointments] = useState([]);

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

  // TIME
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const handleAvailability = (selectedDate, selectedTime) => {
    setDate(new Date(selectedDate));
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    let time  = new Date(selectedDate+"T"+selectedTime)
    setStartTime(new Date(time.getTime() + userTimezoneOffset));
  }
  
  const [mainContact, setMainContact] = useState({'first_name':'','last_name':''})
  useEffect(() => {
    api.get(`/companies/brand/${brand_id}/profile/`).then((response) => {
      setBrand(response.data.brand)
      setMainContact(response.data.brand.members[0])
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

  const createAppointment = duration => {
    console.log(startTime.toTimeString().slice(0,5));
    console.log((new Date(startTime.getTime() + duration*60000)).toTimeString().slice(0,5));
    const payload = {
      'retailer': {'retailer': currentUser.company.id, 'organizer': currentUser.user.id},
      'appointment': {
        'appointment_type': 'SR',
        'name':'Showroom',  //TODO WHAT NAMES GOES HERE?
        'date':date.toISOString().substring(0, 10),
        'start_time':startTime.toTimeString().slice(0,5),
        'end_time':(new Date(startTime.getTime() + duration*60000)).toTimeString().slice(0,5),
        'other_information':''
      },
      'brands': [{
        'brand': brand.id,
        'main_contact':mainContact.id
      }]
    }
    // Checks if there is an team for this appointment
    if (team.length > 0) payload['retailer']['retailer_participants'] =  team.map(x => x.id);
    
    api.post('/appointments/create/', payload).then((response) => {
      clearFields();
      console.log(response.data.brand);
      navigation.navigate('Showroom',{appointment_id:response.data.id});
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
  const clearFields = () => {
    setDate(new Date());
    setStartTime(new Date());
  }
  const goBack = () => {
    navigation.navigate('ContactBrand',{brand_id:brand.id});
  }
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <View style= {styles.column}>
          <View style={styles.row}> 
            <BackHeader goBack={goBack}>  
              <CompanyLogo
                  size={64} 
                  company={brand}  
              />
            </BackHeader>
          </View>
          <HeaderWithSub header={brand.name} subheader={'Showroom Appointment'} />
          <LocationInfo item={brand.current_showroom}/>
          <TeamSelect 
            containerStyle={{marginVertical:16}}
            company={currentUser.company} 
            selectedUsers={team} 
            main_user={currentUser.user}
            addMethod={manageTeam}
            removeMethod={removeTeam}
            start={true}
          />
          <Availabilty users={team} selectMethod={handleAvailability} date={date} time={startTime}/>
          <Contact user={mainContact} />
        </View>
        <DurationModal onFinish={createAppointment} containerStyle={{alignSelf:'flex-end'}}  />
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
