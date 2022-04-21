import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Picker } from 'react-native'
import { Text, Subheading, Searchbar, IconButton, Button } from 'react-native-paper'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import Background from '../../../components/Background'

import { theme } from '../../../core/theme'
import { currentDate } from '../../../utils/date_management';
import BackHeader from '../../../components/BackHeader'
import Availabilty from '../../../components/Availability'
import TextInput from '../../../components/TextInput'

import HeaderLine from '../../../components/HeaderLine'
import PickerDropdown from '../../../components/PickerDropdown'
import AddBrands from '../../../components/AddBrand'
import TeamSelect from '../../../components/TeamSelect'
import CurrentUserContext from '../../../../Context';
import BackgroundAuth from '../../../components/BackgroundAuth';

export default function AppointmentCreateScreen({ route, navigation }) {
  const { ap_type, passed_team, passed_date, passed_time } = route.params; // passes params from previous
  const [availability, setAvailability] = useState({dates: []}) //TODO add availbility
  const [team, setTeam] = useState([])
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  

  // Form values
  // Simple form
  const [name, setName] = useState({ value: '', error: '' }) 
  const [otherInfo, setOtherInfo] = useState({ value: '', error: '' })
  // DATE
  const [date, setDate] = useState(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const showDate = () => {setDateVisible(true);};
  const hideDate = () => {setDateVisible(false);};
  const handleDate = (date) => {
    setDate(date);
    hideDate();
  };
  // TIME
  const [startTime, setStartTime] = useState(new Date());
  const [startTimeVisible, setStartTimeVisible] = useState(false);
  const showStartTime = () => {setStartTimeVisible(true);};
  const hideStartTime = () => {setStartTimeVisible(false);};
  const handleStartTime = (time) => {
    setStartTime(time);
    hideStartTime();
  };

  const [endTime, setEndTime] = useState(new Date());
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  const showEndTime = () => {setEndTimeVisible(true);};
  const hideEndTime = () => {setEndTimeVisible(false);};
  const handleEndTime = (time) => {
    setEndTime(time);
    hideEndTime();
  };
  
  // Time via availability
  const handleAvailability = (selectedDate, selectedTime) => {
    setDate(new Date(selectedDate));
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    let time  = new Date(selectedDate+"T"+selectedTime)
    setStartTime(new Date(time.getTime() + userTimezoneOffset));
  }

  // Brands
  const [brands, setBrands] = useState({value:[], error:''});
  

  const editBrand = id => {
    showBrandModal();
    axios.get(`companies/brand/${id}/`).then((response) => {
      setSelectedBrand(response.data);
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
  }
  const addBrand = (item) => {
    var current_brands = brands.value.filter(ar => ar.id !== item.id)
    if(ap_type==='SR') current_brands = []
    current_brands.push(item);
    setBrands({value:current_brands, error:''});
  }
  // Brand management from main form
  const removeBrand = id => {
    setBrands({value:brands.value.filter(ar => ar.id !== id), error:''});
  }

  // Methods for managing team
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
  const appointment_types = {
    'TS':'Trade Show',
    'SR': 'Showroom',
    'OT': 'Other Appointment'
  }
  // On load of screen, fetch selected items. 
  useEffect(() => {
    clearFields();
    setTeam(passed_team); // fetch passed params of team
    axios.get(`companies/brands`).then((response) => {
      setBrandSearchResults(response.data);
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
  }, [ap_type]);

  useEffect(() => {
    if (typeof passed_date !== undefined && passed_time !== undefined) {
      if (passed_date.length > 0 && passed_time.length > 0) handleAvailability(passed_date,passed_time);
    }
  }, [passed_time, passed_date]);
  // create appointment post
  const createAppointment = () => {
    const payload = {
      'retailer': {'retailer': currentUser.company.id, 'organizer': currentUser.user.id},
      'appointment': {
        'appointment_type': ap_type,
        'name':name.value, 
        'date':date.toISOString().substring(0, 10),
        'start_time':startTime.toTimeString().slice(0,5),
        'end_time':endTime.toTimeString().slice(0,5),
        'other_information':otherInfo.value,
      },
      'brands':brands.value.map(item => ({'brand':item.id, 'main_contact':item.main_contact.id}))
    }

    // Checks if there is an team for this appointment
    if (team.length > 0) payload['retailer']['retailer_participants'] =  team.map(x => x.id);

    axios.post('/appointments/create/', payload).then((response) => {
      clearFields();
      if (response.data.appointment_type!=='SR') {
        navigation.navigate('MultiAppointment',{ 
          screen: 'MultiAppointmentScreen',
          params:{appointment_id:response.data.id}
        });
      } else {
        navigation.navigate('Showroom',{ 
          screen: 'ShowroomScreen',
          params:{appointment_id:response.data.id}
        });
      }
    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        if (error.response.data.hasOwnProperty("appointment")) {
          if(error.response.data.appointment.hasOwnProperty("name")) {
            setName({error: error.response.data.appointment.name[0]})
          }
          if(error.response.data.appointment.hasOwnProperty("start_time")) {
            setStartTime({error: error.response.data.appointment.start_time[0]})
          }
          if(error.response.data.appointment.hasOwnProperty("end_time")) {
            setEndTime({error: error.response.data.appointment.end_time[0]})
          }
          if(error.response.data.appointment.hasOwnProperty("date")) {
            setDate({error: error.response.data.appointment.date[0]})
          }
          if(error.response.data.appointment.hasOwnProperty("other_information")) {
            setOtherInfo({error: error.response.data.appointment.other_information[0]})
          }
        }
        if (error.response.data.hasOwnProperty("brands")) {
          if (error.response.data.brands.hasOwnProperty("non_field_errors")) {
            setBrands({value:brands.value, error:error.response.data.brands.non_field_errors[0]})
          }
        }
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
  }

  const clearFields = () => {
    setName({ value: '', error: '' });
    setOtherInfo({ value: '', error: '' });
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setBrands({value:[], error:''});

  }

return (
<BackgroundAuth>
  {!authIsLoading &&
  <View style= {styles.column}>
      <BackHeader goBack={navigation.goBack}>
          <Text style={{color:theme.colors.grey}}>
          {appointment_types[ap_type]}
          </Text>
      </BackHeader>
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
      <View style={{flex:2}}>
        <TextInput
          label="Title"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />
        <View>
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1}} onPress={showDate}>
            <TextInput
              label="Date"
              returnKeyType="next"
              value={date.toISOString().substring(0, 10)}
              disabled={true}
              
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={dateVisible}
            mode="date"
            onConfirm={handleDate}
            onCancel={hideDate}
          />
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1, flex:1}} onPress={showStartTime}>
            <TextInput
              label="Start Time"
              returnKeyType="next"
              value={startTime.toTimeString().slice(0,5)}
              disabled={true}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={startTimeVisible}
            mode="time"
            onConfirm={handleStartTime}
            onCancel={hideStartTime}
          />
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1,flex:1}} onPress={showEndTime}>
            <TextInput
              label="End Time"
              returnKeyType="next"
              value={endTime.toTimeString().slice(0,5)}
              disabled={true}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={endTimeVisible}
            mode="time"
            onConfirm={handleEndTime}
            onCancel={hideEndTime}
          />
        </View>
        <View>
          <HeaderLine containerStyle={{marginVertical:8}} textStyle={{fontSize:16, paddingHorizontal:8}}>
            {ap_type !== 'SR' ? 'Brands':'Brand'}        
          </HeaderLine>
            {
            brands.value.map((item, index) => {
                return(
                  <View style={styles.teamRow}>
                    <TouchableOpacity onPress={() => editBrand(item.id)}>
                      <Text>{item.name}</Text>
                      <Text>Contact {(item.hasOwnProperty('main_contact')) && item.main_contact.name}</Text>
                    </TouchableOpacity>
                    <IconButton onPress={() => removeBrand(item.id)} icon='close'/>
                  </View>
                );     
              })
            }
            {brands.error.length > 0 &&
              <Text style={{color:theme.colors.danger, textAlign:'center', marginBottom:16}}>{brands.error}</Text>
            }
          <AddBrands completeAction={addBrand} />
        </View>
        <TextInput
          label="Other Info"
          returnKeyType="next"
          value={otherInfo.value}
          multiline
          onChangeText={(text) => setOtherInfo({ value: text, error: '' })}
          error={!!otherInfo.error}
          errorText={otherInfo.error}
        />

      <Button mode="contained" style = {{backgroundColor: theme.colors.grey, color: theme.colors.primary, marginTop:32}} onPress={createAppointment}>
        Create Appointment
      </Button>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
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
    margin:4
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
