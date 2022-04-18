import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { TouchableOpacity, StyleSheet, View, ScrollView, Text} from 'react-native'
import {  DataTable, Modal, Portal } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import Link from '../components/Link'
import PillLink from '../components/PillLink'
import { currentDate } from '../utils/date_management'
import { placeholder } from '../core/placeholders'
import { theme } from '../core/theme'
import CalendarFull from '../components/calendar/Calendar.js'
import AgendaScreen from '../components/calendar/Agenda.js'
import HoveringBar from '../components/HoveringBar.js'
import AppointmentsList from '../components/AppointmentList';
import ProfilePicture from '../components/ProfilePicture';
import Dropdown from '../components/Dropdown';

export default function Dashboard({ navigation }) {
  const today = currentDate()
  const [user, setUser] = useState({ first_name:"" });
  const [appointments, setAppointments] =useState([]);
  const [apType, setApType] = useState({label:'All', value:'AL'});
  const apTypes = [
    {'label':'All', 'value':'AL'},
    {'label':'Showroom', 'value':'SR'},
    {'label':'Trade Show', 'value':'TS'},
    {'label':'Other', 'value':'OR'}
  ]
  // AP Modal
  const [apModalVisible, setApModalVisible] = useState(false);
  const showAPModal = () => {
    setApModalVisible(true); 
  }

  const hideAPModal= () => setApModalVisible(false);

  const changeApType = (item) => {
    setApType(item);
    hideAPModal();
  }
  useEffect(() => {
    axios.get('/accounts/current_user/').then((response) => {
      setUser(response.data.user);
    }).catch(function (error) {
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
    axios.get('/appointments/user/').then((response) => {
      setAppointments(response.data)
      console.log(response.data)
    }).catch(function (error) {
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
      <View style = {styles.column}>
        <View style={[styles.row, {flex:2, paddingTop:32}]}>
          <View style={{flex: 3}}>
            <Header>Hi, {user.first_name}</Header>
          </View>
          <View style={{flex: 1}}>
            <ProfilePicture
            size={64} 
            user={user} />

          </View>
        </View>
        <Header>Notifications</Header> 
        <View style={{flex:3}}>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
          <PillLink>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </PillLink>
        </View>
        <View style={[styles.column, {flex:3}]}>
          <View style={[styles.row, {flex:0, justifyContent: 'space-between'}]}>
              <Header style={{fontSize: 24}}>Today, {today}</Header>
              <View style={{top:16}}>
                <Link onPress={showAPModal}>{apType.label}</Link>
              </View>
          </View>
          <Portal>
            <Modal visible ={apModalVisible} onDismiss={hideAPModal} contentContainerStyle={styles.apModal}>
            {apTypes.map((item, index) => {
                return(
                      <Link style={{fontSize:20, textAlign:'center'}} onPress={() => changeApType(item)}>{item.label}</Link>
                )
              })
            }
            </Modal>
          </Portal>
          <AppointmentsList data={appointments} ap_type={apType.value}/>
        </View>         
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  notification: {
    backgroundColor:theme.colors.grey,
  },
  apModal : {
    backgroundColor: 'white', 
    padding: 20
  }
})