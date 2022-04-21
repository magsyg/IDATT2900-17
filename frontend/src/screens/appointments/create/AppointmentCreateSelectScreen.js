import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Text, Subheading, Searchbar, IconButton } from 'react-native-paper'
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
import CurrentUserContext from '../../../../Context'
import BackgroundAuth from '../../../components/BackgroundAuth'

export default function AppointmentCreateSelectScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const [team, setTeam] = useState([])
 
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const handleAvailability = (selectedDate, selectedTime) => {
    setTime(selectedTime);
    setDate(selectedDate);
  }
  
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


  const next_page = (val) => {
    const passed_data = {
      passed_team: team,
      ap_type: val, 
      passed_time: time,
      passed_date: date,
    }
    switch(val) {
      case 'TS': 
        navigation.navigate('AppointmentCreateForm', passed_data)
        break;
      case 'OT': 
        navigation.navigate('AppointmentCreateForm', passed_data)
        break;
      case 'SR': 
        navigation.navigate('AppointmentCreateShowroomSearchScreen', passed_data)
        break;
        
    }
  }

  return (
<BackgroundAuth>
  {!authIsLoading &&
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
          company={currentUser.company} 
          selectedUsers={team} 
          main_user={currentUser.user}
          addMethod={manageTeam}
          removeMethod={removeTeam}
          start={true}
      />
        <View style={{flex:3}}>
        <Availabilty users={team} selectMethod={handleAvailability} date={date} time={time}/>
      </View>
  </View>
  }
</BackgroundAuth>
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
