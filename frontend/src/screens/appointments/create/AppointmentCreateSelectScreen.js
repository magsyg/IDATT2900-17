import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, Avatar, IconButton } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import { currentDate } from '../../../utils/date_management';
import Availabilty from '../../../components/Availability'
import HoveringBar from '../../../components/HoveringBar'
import TeamSelect from '../../../components/TeamSelect'

export default function AppointmentCreateSelectScreen({ route, navigation }) {
  
  const [availability, setAvailability] = useState({dates: []})
  const [team, setTeam] = useState([])
  const [meta, setMeta] = useState({company:{id:-1, members:[]}, user: {id:-1, first_name:'User'}}) // add placeholders

  const manageTeam = teamMember => {
      var added = team;
      if (teamMember.id != -1) {
        added.push(teamMember)
        added = added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => ar.id !== meta.user.id);
      }
      setTeam(added)
  }

  const removeTeam = teamMember => {
    let added = team.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => (ar.id !== meta.user.id && ar.id !== teamMember.id));
    setTeam(added)
  }


  const next_page = (val) => {
    switch(val) {
      case 'TS': 
        navigation.navigate('AppointmentCreateForm', {
          passed_team: team,
          ap_type: val, 
        })
        break;
      case 'OT': 
        navigation.navigate('AppointmentCreateForm', {
          passed_team: team,
          ap_type: val, 
        })
        break;
      case 'SR': 
        navigation.navigate('AppointmentCreateShowroomSearchScreen', {
          passed_team: team,
          ap_type: val, 
        })
        break;
        
    }
  }
  useEffect(() => {
    /**
    let d = new Date();
    let date_list = [];
    for (let i = 0; i < 10; i++) {
      date_list.push({
        date: d,
        time_list:[
          '09:00',
          '10:00',
          '14:00',
        ]
      })
      d.setDate(d.getDate+1);
    }
    setAvailability(date_list);
    */
    axios.get('/appointments/create/').then((response) => {
      setMeta(response.data);
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

  // update team on company members
  useEffect(() => {
    // using useEffect in this way, with end param, causes this function to run each time the end param is changed
    manageTeam(meta.user);
  },[meta]);


  return (
<Background>
  <View style= {styles.column}>
  <View style={{flex:1, marginTop:16}}>
      <Searchbar placeholder="Search"       
        style={{backgroundColor:theme.colors.lightgrey, borderRadius:100}}
      />
      </View>
      <View style={{flex:2, marginTop:32}}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => next_page('SR')}>
              <Text style={styles.boxText}>Showroom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => next_page('TS')}>
              <Text style={styles.boxText}>Trade Show</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box}>
              <Text style={styles.boxText}>Runway</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => next_page('OT')}>
              <Text style={styles.boxText}>Other</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TeamSelect 
          containerStyle={{flex:1, paddingVertical:32}} 
          company={meta.company} 
          selectedUsers={team} 
          main_user={meta.user}
          addMethod={manageTeam}
          removeMethod={removeTeam}
          start={true}
      />
      <View style={{flex:3}}>
      <Availabilty data={availability}/>
      </View>
  </View>
</Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    width:'100%'
  },
  box: {
    flex:1,
    backgroundColor: theme.colors.lightgrey,
    paddingVertical:'auto',
    borderRadius:16,
    flexDirection: 'column',
    justifyContent:'center',
    margin:4,
    padding:32
  },
  boxText: {
    margin:'auto',
    textAlign: 'center',
    color:theme.colors.primary,
    alignItems:'center',
    fontSize:16,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomColor: theme.colors.grey,
    borderBottomWidth: 1,
    marginBottom:8,
    padding:4, 
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
})
