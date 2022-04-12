import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Picker } from 'react-native'
import { Text, Subheading, Searchbar, Avatar, IconButton, Button } from 'react-native-paper'
import Background from '../../../components/Background'
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from '../../../components/Header'
import OptionIconLink from '../../../components/OptionIconLink'
import BackButton from '../../../components/BackButton'

import { theme } from '../../../core/theme'
import { currentDate } from '../../../utils/date_management';
import BackHeader from '../../../components/BackHeader'
import Availabilty from '../../../components/Availability'
import TextInput from '../../../components/TextInput'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HeaderLine from '../../../components/HeaderLine'
import PickerDropdown from '../../../components/PickerDropdown'
import AddBrands from '../../../components/AddBrand'
import TeamSelect from '../../../components/TeamSelect'

export default function AppointmentCreateScreen({ route, navigation }) {
  const { ap_type, passed_team, brand_id } = route.params; // passes params from previous
  const [availability, setAvailability] = useState({dates: []}) //TODO add availbility
  const [team, setTeam] = useState([])
  const [meta, setMeta] = useState({company:{id:-1, members:[]}, user: {id:-1, first_name:'User'}}) // add placeholders
  

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
  const [time, setTime] = useState(new Date());
  const [timeVisible, setTimeVisible] = useState(false);
  const showTime = () => {setTimeVisible(true);};
  const hideTime = () => {setTimeVisible(false);};
  const handleTime = (time) => {
    setTime(time);
    hideTime();
  };
  
  // Brands
  const [brands, setBrands] = useState({value:[], error:''});

  // For Showroom only
  const [mainContact, setMainContact] = useState({value:{}, errors:''});

  const selectMainContact = (id) => {
    var result = brands.value[0].members.find(obj => {
      return obj.id === id
    })
    if (typeof result !== "undefined") setMainContact({value:result, errors:''});    
  }
  

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
    let current_brands = brands.value.filter(ar => ar.id !== item.id)
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
      added = added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => ar.id !== meta.user.id);
    }
    setTeam(added)
  }

  const removeTeam = teamMember => {
    let added = team.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => (ar.id !== meta.user.id && ar.id !== teamMember.id));
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

    if(ap_type==='SR') {
      axios.get(`companies/brand/${brand_id}/`).then((response) => {
        setBrands({value:[response.data], error:''})
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
  }, [ap_type, brand_id]);

  // create appointment post
  const createAppointment = () => {
    const payload = {
      'retailer': {'retailer': meta.company.id, 'organizer': meta.user.id},
      'appointment': {
        'appointment_type': ap_type,
        'name':name.value, 
        'date':date.toISOString().substring(0, 10),
        'time':time.toTimeString().slice(0,5),
        'other_information':otherInfo.value,
      }
    }
    if (ap_type==='SR') {
      payload['brands'] = [{'brand':brands.value[0].id, 'main_contact':mainContact.value.id}];
    } else {
      payload['brands'] = brands.value.map(item => ({'brand':item.id, 'main_contact':item.main_contact.id}));
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
          if(error.response.data.appointment.hasOwnProperty("time")) {
            setTime({error: error.response.data.appointment.time[0]})
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
          if (error.response.data.brands[0].hasOwnProperty("main_contact")) {
            setMainContact({value:mainContact.value, error:error.response.data.brands[0].main_contact[0]})
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
    setTime(new Date());
    setBrands({value:[], error:''});
    setMainContact({value:{}, errors:''});
  }

return (
<Background>
  <View style= {styles.column}>
      <BackHeader goBack={navigation.goBack}>
          <Text style={{color:theme.colors.grey}}>
          {appointment_types[ap_type]}
          </Text>
      </BackHeader>
        <TeamSelect 
          containerStyle={{marginVertical:16}}
          company={meta.company} 
          selectedUsers={team} 
          main_user={meta.user}
          addMethod={manageTeam}
          removeMethod={removeTeam}
          start={true}
        />
      <Availabilty/>
      <View style={{flex:2}}>
        <TextInput
          label="Title"
          returnKeyType="next"
          value={name.value}
          onChangeText={(text) => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />
        {(ap_type === 'SR' && brands.value.length > 0) &&
        <View>
            <View style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1}}>
              <TextInput
                label="Brand"
                returnKeyType="next"
                value={brands.value[0].name}
                disabled={true}
              
              />
          </View>
          <PickerDropdown 
            selectMethod={selectMainContact}
            data = {
              brands.value[0].members.map(item => ({label:item.first_name + " "+ item.last_name, value:item.id}))
            }
            label="Main Contact"
            errors={mainContact.error}
          />
        </View>
        }
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
        
        <View>
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1}} onPress={showTime}>
            <TextInput
              label="Time"
              returnKeyType="next"
              value={time.toTimeString().slice(0,5)}
              disabled={true}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={timeVisible}
            mode="time"
            onConfirm={handleTime}
            onCancel={hideTime}
          />
        </View>
        {ap_type !== 'SR' &&
        <View>
          <HeaderLine containerStyle={{marginVertical:8}} textStyle={{fontSize:16, paddingHorizontal:8}}>
            Brands        
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
        }
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
