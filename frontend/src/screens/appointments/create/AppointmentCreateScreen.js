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
import Dropdown from '../../../components/Dropdown'
import PickerDropdown from '../../../components/PickerDropdown'

export default function AppointmentCreateScreen({ route, navigation }) {
  const { ap_type, passed_team } = route.params; // passes params from previous
  const [availability, setAvailability] = useState({dates: []}) //TODO add availbility
  const [team, setTeam] = useState({added: [], unadded:[]})
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
  
  // Brand
  const [brands, setBrands] = useState({value:[], error:''});

  //Brand management
  const [selectedBrand, setSelectedBrand] = useState({});
  const [mainContact, setMainContact] = useState({value:{}, errors:''});

  // Brand search
  const [brandVisible, setBrandVisible] = useState(false);
  const [brandSearchResults, setBrandSearchResults] = useState([]);
  const [searchBrandText, setSearchBrandText] = React.useState('');
  const showBrandModal = () => setBrandVisible(true);
  const hideBrandModal = () => setBrandVisible(false);

  const onChangeBrandSearch = text => {
    const formattedQuery = text.toLowerCase();
    
    axios.get(`companies/brands?name=${text}`).then((response) => {
      setBrandSearchResults(response.data);
      console.log(response.data);
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
    setSearchBrandText(text)
  };

  const selectMainContact = (id) => {
    var result = selectedBrand.members.find(obj => {
      return obj.id === id
    })
    if (typeof result !== "undefined") setMainContact({value:result, errors:''});    
  }
  
  // Selected brand management
  const addBrand = () => {
    if (Object.keys(mainContact.value).length != 0) {
      let brand = {'id': selectedBrand.id, 'name':selectedBrand.name, 'main_contact':{'id':mainContact.value.id, 'name':mainContact.value.first_name+" "+mainContact.value.last_name}}
      let current_brands = brands.value.filter(ar => ar.id !== brand.id);
      current_brands.push(brand);
      setBrands({value:current_brands, error:''});
      setSelectedBrand({});
      setMainContact({value:{}, errors:''});
      hideBrandModal();
    } else {
      setMainContact({errors:'Must set a main contact'})
    }
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
  // Brand management from main form
  const removeBrand = id => {
    setBrands({value:brands.value.filter(ar => ar.id !== id), error:''});
  }
  
  const selectBrand = (item) => {
    setSelectedBrand(item);
  }

  // Methods for managing team
  const [teamVisible, setTeamVisible] = useState(false);
  const showTeamModal = () => setTeamVisible(true);
  const hideTeamModal = () => setTeamVisible(false);

  const manageTeam = teamMember => {
      console.log(meta.user.id);
      var added = team.added;
      if (teamMember.id != -1) {
        team.added.push(teamMember)
        added = team.added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => ar.id !== meta.user.id);
      }

      let unadded = meta.company.members.filter(ar => !added.find(rm => (rm.id === ar.id))).filter(ar => ar.id !== meta.user.id);
      setTeam({added:added, unadded:unadded})
      console.log(team);

  }
  const removeTeam = teamMember => {
    let added = team.added.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i).filter(ar => (ar.id !== meta.user.id && ar.id !== teamMember.id));
    let unadded = meta.company.members.filter(ar => !added.find(rm => (rm.id === ar.id || ar.id === meta.user.id)))

    setTeam({added:added, unadded:unadded})
  }

  const appointment_types = {
    'TS':'Trade Show'
  }
  // On load of screen, fetch selected items. 
  useEffect(() => {
    setTeam(passed_team); // fetch passed params of team
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
  }, []);

  // create appointment post
  const createAppointment = () => {
    const payload = {
      'brands': brands.value.map(item => ({'brand':item.id, 'main_contact':item.main_contact.id})),
      'retailer': {'retailer': meta.company.id, 'organizer': meta.user.id},
      'appointment': {
        'appointment_type': ap_type,
        'name':name.value, 
        'date':date.toISOString().substring(0, 10),
        'time':time.toTimeString().slice(0,5),
        'other_information':otherInfo.value,
      }
    }
    // Checks if there is an team for this appointment
    if (team.added.length > 0) payload['retailer']['retailer_participants'] =  team.added.map(x => x.id);

    axios.post('/appointments/create/', payload).then((response) => {
      navigation.navigate('AppointmentCreateSelect'); //TODO Replace this with the appointment
    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        if (error.response.data.hasOwnProperty("appointment")) {
          console.log("has appointment error")
          if(error.response.data.appointment.hasOwnProperty("name")) {
            setName({error: error.response.data.appointment.name[0]})
            console.log()
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
  <Modal visible={brandVisible} onDismiss={hideBrandModal}>
      {Object.keys(selectedBrand).length === 0  ?
        <View style= {styles.column}>
          <View style={[styles.row, {flex:0,justifyContent:'space-between',marginHorizontal: 8, marginVertical:18}]}>
            <Searchbar placeholder="Search"       
                onChangeText={onChangeBrandSearch}
                value={searchBrandText}
                style={{backgroundColor:theme.colors.grey, flex:1, borderRadius:100}}
              />
            <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideBrandModal}></IconButton>
          </View>
          <View style={{flex:1}}>
            <FlatList
              data={brandSearchResults}
              numColumns={1}
              scrollEnabled={true}
              renderItem={({item, index}) => 
                  <TouchableOpacity onPress={() => selectBrand(item)} key={index} style={[styles.teamRow, {justifyContent:'flex-start'}]}>
                    <Avatar.Image 
                      size={40} 
                      source={require('../../../assets/default_profile.png')}  
                    />
                    <Subheading style={{marginLeft:16}}>{item.name}</Subheading>
                  </TouchableOpacity>
              }
            />
          </View>
        </View>
      :
      <View style= {styles.column}>
        <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
          <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hideBrandModal}></IconButton>
        </View>
        <View style={{flex:0}}>
          <Header style={{color:theme.colors.primary, textAlign:'center'}}>Add Brand</Header>
        </View>
        <View style={{flex:1, padding:32}}>
          <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1}} onPress={() => selectBrand({})}>
            <TextInput
              label="Brand"
              returnKeyType="next"
              value={selectedBrand.name}
              disabled={true}
            />
          </TouchableOpacity>
          <PickerDropdown 
            selectMethod={selectMainContact}
            data = {
              selectedBrand.members.map(item => ({label:item.first_name + " "+ item.last_name, value:item.id}))
            }
            label="Main Contact"
            errors={mainContact.errors}
          />
          <Button icon="plus" style={{marginTop:16}} color={theme.colors.grey} mode="outlined" onPress={addBrand}>Add Brand</Button>
        </View>
      </View>
      }
  </Modal>
  <View style= {styles.column}>
      <BackHeader goBack={navigation.goBack}>
          <Text style={{color:theme.colors.grey}}>
          {appointment_types[ap_type]}
          </Text>
      </BackHeader>
      <View style={[styles.column, {flex:0, marginVertical:16}]}>
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
        <Availabilty/>
      </View>
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
                      <Text>Contact {item.main_contact.name}</Text>
                    </TouchableOpacity>
                    <IconButton onPress={() => removeBrand(item.id)} icon='close'/>
                  </View>
                );     
              })
            }
            {brands.error.length > 0 &&
              <Text style={{color:theme.colors.danger, textAlign:'center', marginBottom:16}}>{brands.error}</Text>
            }
          <Button icon="plus"  color={theme.colors.grey} mode="outlined" onPress={showBrandModal}>Add Brand</Button>
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
