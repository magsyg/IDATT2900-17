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

export default function AppointmentCreateSelectScreen({ route, navigation }) {
  
  const [availability, setAvailability] = useState({dates: []})
  const [team, setTeam] = useState({added: [], unadded:[]})
  const [meta, setMeta] = useState({company:{id:-1, members:[]}, user: {id:-1, first_name:'User'}}) // add placeholders


  const [teamVisible, setTeamVisible] = React.useState(false);
  const showTeamModal = () => setTeamVisible(true);
  const hideTeamModal = () => setTeamVisible(false);

  const manageTeam = teamMember => {
      var added = team.added;
      if (teamMember.id != -1) {
        team.added.push(teamMember)
        added = team.added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => ar.id !== meta.user.id);
      }

      let unadded = meta.company.members.filter(ar => !added.find(rm => (rm.id === ar.id))).filter(ar => ar.id !== meta.user.id);
      setTeam({added:added, unadded:unadded})

  }
  const removeTeam = teamMember => {
    let added = team.added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => (ar.id !== meta.user.id && ar.id !== teamMember.id));
    let unadded = meta.company.members.filter(ar => !added.find(rm => (rm.id === ar.id || ar.id === meta.user.id)))

    setTeam({added:added, unadded:unadded})
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
  <Modal visible={teamVisible} onDismiss={hideTeamModal}>
    <View style= {styles.column}>
      <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
        <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideTeamModal}></IconButton>
      </View>
      <View style={{flex:0}}>
        <Header style={{color:theme.colors.primary, textAlign:'center'}}>ADD TEAM MEMBERS</Header>
      </View>
      <View style={{flex:1, paddingHorizontal:32}}>
        <FlatList
          data={team.unadded}
          numColumns={1}
          scrollEnabled={true}
          renderItem={({item, index}) => 
              <View key={index} style={styles.teamRow}>
                  <Avatar.Image 
                    size={40} 
                    source={require('../../../assets/default_profile.png')}  
                  />
                  <Subheading>{item.first_name} {item.last_name}</Subheading>
                  <IconButton icon='plus' onPress={() => manageTeam(item)} color={theme.colors.grey}/>
              </View>
          }
        />
      </View>
    </View>
  </Modal>
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
      <View style={{flex:1, paddingVertical:32}}>
        <ScrollView horizontal={true} contentContainerStyle={{justifyContent:'flex-start'}}>
          <View style={{margin:2}}>
            <Avatar.Image 
                size={48} 
                source={require('../../../assets/default_profile.png')}  
              />
          </View>
          {
          team.added.map((item, index) => {
              return(
                <TouchableOpacity key={index} style={{margin:2}} onPress={() => removeTeam(item)}>
                  <Avatar.Image 
                    size={48} 
                    source={require('../../../assets/default_profile.png')}  
                  />
                </TouchableOpacity>
              );     
            })
          }
          <IconButton icon='plus' onPress={showTeamModal} color={theme.colors.grey}/>
        </ScrollView>
      </View>
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
