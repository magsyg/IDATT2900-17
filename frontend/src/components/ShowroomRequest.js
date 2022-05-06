import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native'
import { IconButton, Subheading, Portal, Modal as PModal } from 'react-native-paper'
import { theme } from '../core/theme'
import {useNavigation} from '@react-navigation/native';
import { transformNiceDate } from '../utils/date_management'
import CurrentUserContext from '../../Context'
import AppointmentInfo from './AppointmentInfo'
import Button from './Button'
import CompanyLogo from './CompanyLogo'
import Header from './Header'
import Header2 from './Header2'
import OutlinedButton from './OutlinedButton'
import Paragraph from './Paragraph'
import PillLink from './PillLink'
import ProfilePicture from './ProfilePicture'
import Availabilty from './Availability'
import { ScrollView } from 'react-native-gesture-handler'
import api from '../../api'

export default function ShowroomRequest({appointment, onUpdate}) {
  const { currentUser } = React.useContext(CurrentUserContext);

  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);


  const [team, setTeam] = useState([currentUser])
  
  
  const [visibleC, setVisibleC] = useState(false);
  const toggleCModal = () => setVisibleC(!visibleC);
  const [timeChanged, setTimeChanged] = useState(false);
  const [timeNotSetError, setTimeNotSetError] = useState(false);
  // TIME
  const [changedDate, setChangedDate] = useState(new Date());
  const [changedStartTime, setChangedStartTime] = useState(new Date());
  const [changedEndTime, setChangedEndTime] = useState(new Date());
  // Time via availability
  const handleAvailability = (selectedDate, selectedTime) => {

    setChangedDate(new Date(selectedDate));
    let userTimezoneOffset = changedDate.getTimezoneOffset() * 60000;
    let time  = new Date(selectedDate+"T"+selectedTime)
    setChangedStartTime(new Date(time.getTime() + userTimezoneOffset));
    setChangedEndTime(new Date(time.getTime() + userTimezoneOffset+60000*30)); //TODO make cleaner
    setTimeChanged(true);
    setTimeNotSetError(false);
  }

  const is_new_contact = () => {
    return !currentUser.company.contacts.map(c => c.id).includes(appointment.retailer.retailer.id)
  }
  useEffect(() => {
    let newTeam = [currentUser, appointment.retailer.organizer]
    // TODO add for whole participating team
    setTeam(newTeam)
  }, [appointment]);

  const decline = () => {
    api.post(`/appointments/user/requests/${appointment.id}/decline/`).then((response) => {
      onUpdate();
      hideModal();
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
  }
  const accept = () => {
    console.log(appointment.date === null)
    console.log(!timeChanged)

    if (appointment.date === null && !timeChanged) {
      setTimeNotSetError(true)
      return
    }
    var payload = {
      'date': appointment.date,
      'end_time': appointment.end_time,
      'start_time': appointment.start_time,
    }
    if (timeChanged) {
      payload = {
        'date': changedDate.toISOString().substring(0, 10),
        'end_time': changedEndTime.toTimeString().slice(0,5),
        'start_time': changedStartTime.toTimeString().slice(0,5),
      }
    }
    api.post(`/appointments/user/requests/${appointment.id}/accept/`, payload).then((response) => {
      navigation.navigate('Showroom',{appointment_id:response.data.id});
      onUpdate();
      hideModal();
    }).catch(function (error) {
     
    });
  }

  return (
    <View>
      <TouchableOpacity style={[styles.row, styles.enterButtonStyle]} onPress={showModal}>
        <Text style={{color:theme.colors.secondary}}>SR Request</Text>
        <Text>{appointment.retailer.retailer.name}</Text>
      </TouchableOpacity>
      <Modal visible={visible} onDismiss={hideModal}>
      <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'space-between',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
            <Header2 style={{color:theme.colors.grey}}>Showroom Request</Header2>
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideModal}></IconButton>
          </View>
          <ScrollView style= {styles.column}>
          <View style={styles.row}>
            <CompanyLogo
                  size={96} 
                  company={appointment.retailer.retailer}  
              />
          </View>
          <View style={[styles.row, {margin:4}]}>
            <Subheading style={{color:theme.colors.secondary}}>
              {appointment.retailer.retailer.name}
            </Subheading>
          </View>
          <View style={styles.row}>
            <PillLink>{appointment.retailer.retailer.homepage}</PillLink>
          </View>
          <View style={{margin:8}}>
            <View style={[styles.row]}>
              <Subheading>
                Time
              </Subheading>
            </View>
            {appointment.date &&
            <View style={[styles.row, {marginTop:8, justifyContent:'space-between', paddingHorizontal:32}]}>
              <Text style={timeChanged && {color:theme.colors.grey, textDecorationLine:'line-through'}}>{appointment.start_time.slice(0,5)} - {appointment.end_time.slice(0,5)}</Text>
              <Text style={timeChanged && {color:theme.colors.grey, textDecorationLine:'line-through'}}>{transformNiceDate(appointment.date)}</Text>
            </View>
            }
            {timeChanged &&
              <View style={[styles.row, {marginTop:8, justifyContent:'space-between', paddingHorizontal:32}]}>
                <Text>{changedStartTime.toTimeString().slice(0,5)} - {changedEndTime.toTimeString().slice(0,5)}</Text>
                <Text>{transformNiceDate(changedDate)}</Text>
              </View>
            }
          </View>
          <View style={{paddingHorizontal:32}}>
          <OutlinedButton onPress={toggleCModal}>{is_new_contact() ? "Set":"Change"} time</OutlinedButton>
          </View>
          {visibleC &&
            <View style={{paddingHorizontal:32}} visible={visibleC}>
              <Availabilty users={team} selectMethod={handleAvailability} date={changedDate} time={changedStartTime}/> 
            </View>
          }
          {timeNotSetError &&
            <Text style={{textAlign:'center', color:theme.colors.danger}}>Time not set</Text>
          }
        </ScrollView>
        <View style={[styles.row, {padding:16}]}>
          <OutlinedButton onPress={decline} labelStyle={{color:theme.colors.danger}} style={[styles.buttonStyle, {borderColor:theme.colors.danger}]}>
            Decline
          </OutlinedButton>
          <OutlinedButton onPress={accept} labelStyle={{color:theme.colors.secondary}} style={[styles.buttonStyle, {borderColor:theme.colors.secondary}]}>
            Accept
          </OutlinedButton>
        </View>
        </View>
      </Modal>
    </View>
  )
}
/**
 *        
 */
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
  },
  enterButtonStyle: {
    borderRadius:2, 
    borderWidth:1,
    marginVertical:8, 
    padding:8,
    borderColor:theme.colors.lightgrey,
    justifyContent:'space-between',
  },
  buttonStyle: {
    color:theme.colors.danger, 
    flex:1, 
    marginHorizontal:8,
    borderWidth:1.5,
  },
  cModal: {
    width:5
  }
})