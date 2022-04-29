import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Text, Subheading, IconButton } from 'react-native-paper'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Background from '../../../../components/Background'
import Header from '../../../../components/Header'
import OptionIconLink from '../../../../components/OptionIconLink'
import Icon from "react-native-vector-icons/MaterialIcons";
import BackButton from '../../../../components/BackButton'
import { theme } from '../../../../core/theme'
import Paragraph from '../../../../components/Paragraph'
import ProfilePicture from '../../../../components/ProfilePicture'
import CompanyLogo from '../../../../components/CompanyLogo'
import TextInput from '../../../../components/TextInput'
import Button from '../../../../components/Button'
import BackgroundAuth from '../../../../components/BackgroundAuth'
import CurrentUserContext from '../../../../../Context'
import api from '../../../../../api'
import Link from '../../../../components/Link';

export default function SettingsShowroomEdit({ route, navigation }) {
  const { currentUser, authIsLoading, checkLogin } = React.useContext(CurrentUserContext);

  const {showroom_id} = route.params

  const [showroom, setShowroom]  = useState({})
  
  const [ doorCode, setDoorCode ] = useState({value:'', error:''})
  const [floor, setFloor] = useState({value:'', error:''})

  
  const [address, setAddress] = useState({value:'', error:''})
  const [city, setCity] = useState({value:'', error:''})
  const [country, setCountry] = useState({value:'', error:''})


  // TIME
  const [startTime, setStartTime] = useState(new Date("July 1 2000 9:00"));
  const [startTimeVisible, setStartTimeVisible] = useState(false);
  const showStartTime = () => {setStartTimeVisible(true);};
  const hideStartTime = () => {setStartTimeVisible(false);};
  const handleStartTime = (time) => {
    setStartTime(time);
    hideStartTime();
  };

  const [endTime, setEndTime] = useState(new Date("July 1 2000 17:00"));
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  const showEndTime = () => {setEndTimeVisible(true);};
  const hideEndTime = () => {setEndTimeVisible(false);};
  const handleEndTime = (time) => {
    setEndTime(time);
    hideEndTime();
  };
  // Date
  const [startDate, setStartDate] = useState(new Date());
  const [startDateVisible, setStartDateVisible] = useState(false);
  const showStartDate = () => {setStartDateVisible(true);};
  const hideStartDate = () => {setStartDateVisible(false);};
  const handleStartDate = (date) => {
    setStartDate(date);
    hideStartDate();
  };

  const [endDate, setEndDate] = useState(new Date());
  const [endDateVisible, setEndDateVisible] = useState(false);
  const showEndDate = () => {setEndDateVisible(true);};
  const hideEndDate = () => {setEndDateVisible(false);};
  const handleEndDate = (date) => {
    setEndDate(date);
    hideEndDate();
  };

  const clearFields = () => {
    setDoorCode({ value: '', error: '' });
    setFloor({ value: '', error: '' });
    setAddress({ value: '', error: '' });
    setCity({ value: '', error: '' });
    setCountry({ value: '', error: '' });
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(new Date('July 1 2000 09:00'));
    setEndTime(new Date('July 1 2000 17:00'));

  }

  const onUpdatePressed = () => {
  // Fetches details about user
  const payload = {
    'doorcode':doorCode.value,
    'floor':floor.value,
    'address':address.value,
    'city':city.value,
    'country':country.value,
    'date_range_start':startDate.toISOString().substring(0, 10),
    'date_range_end':endDate.toISOString().substring(0, 10),
    'hours_start':startTime.toTimeString().slice(0,5),
    'hours_end':endTime.toTimeString().slice(0,5),
  }

  api.post(`/companies/showrooms/${showroom_id}/`, payload).then((response) => {
   navigation.navigate('SettingsShowroomSelect')
  })  .catch(function (error) {
    
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

  const setCurrentShowroom = () => {
    api.post(`/companies/showrooms/${showroom_id}/`, {'set_current':true}).then((response) => {
      setShowroom(response.data);
      checkLogin();
     })  .catch(function (error) {
       
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

  const onDeletePressed = () => {
  
    api.delete(`/companies/showrooms/${showroom_id}/`).then((response) => {
     navigation.navigate('SettingsShowroomSelect')
    })  .catch(function (error) {
      
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
  useEffect(() => {
    // Fetches details about user
    api.get(`/companies/showrooms/${showroom_id}/`).then((response) => {
      setShowroom(response.data)

      setDoorCode({ value: response.data.doorcode, error: '' });
      setFloor({ value: response.data.floor, error: '' });
      setAddress({ value: response.data.address, error: '' });
      setCity({ value: response.data.city, error: '' });
      setCountry({ value: response.data.country, error: '' });
      setStartDate(new Date(response.data.date_range_start));
      setEndDate(new Date(response.data.date_range_end));
      setStartTime(new Date('July 1 2000 '+response.data.hours_start));
      setEndTime(new Date('July 1 2000 '+response.data.hours_end));
    })  .catch(function (error) {
      
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
  }, [showroom_id]);
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <BackButton goBack={navigation.goBack} />
        <View style={styles.column}>
          <View style={[{flex:1,  marginVertical:16}]}>
            <View style={styles.row}>
              <Header>Edit Showroom</Header>
            </View>
            <View style={styles.row}>
              <CompanyLogo
                size={64} 
                company={currentUser.company}  
              />
            </View>
            <View style={[styles.row, {margin:4}]}>
              <Subheading style={{color:theme.colors.secondary}}>
                {currentUser.company.name}
              </Subheading>
            </View>
            <View style={[styles.row, {margin:4}]}>
              {showroom.is_current ? 
                <Text style={{color:theme.colors.secondary}}>Current showroom</Text>
                :
                <TouchableOpacity onPress={setCurrentShowroom}><Text style={{color:theme.colors.secondary}}>Set Current showroom</Text></TouchableOpacity>
              }
  
            </View>
          </View>
          
          <View style={{flex:3, marginTop:16}}>
            <View style={styles.row}>  
              <TextInput
                label="Doorcode"
                returnKeyType="next"
                value={doorCode.value}
                onChangeText={(text) => setDoorCode({ value: text, error: '' })}
                error={!!doorCode.error}
                errorText={doorCode.error}
              />
            </View>
            <View style={styles.row}>  
              <TextInput
                label="Floor"
                returnKeyType="next"
                value={floor.value}
                onChangeText={(text) => setFloor({ value: text, error: '' })}
                error={!!floor.error}
                errorText={floor.error}
              />
            </View>
            <View style={styles.row}>  
              <TextInput
                label="Address"
                returnKeyType="next"
                value={address.value}
                onChangeText={(text) => setAddress({ value: text, error: '' })}
                error={!!address.error}
                errorText={address.error}
              />
            </View>
            <View style={styles.row}>  
              <TextInput
                label="City"
                returnKeyType="next"
                value={city.value}
                onChangeText={(text) => setCity({ value: text, error: '' })}
                error={!!city.error}
                errorText={city.error}
              />
            </View>
            <View style={styles.row}>  
              <TextInput
                label="Country"
                returnKeyType="next"
                value={country.value}
                onChangeText={(text) => setCountry({ value: text, error: '' })}
                error={!!country.error}
                errorText={country.error}
              />
            </View>
          </View>
          <View style={styles.row}>
                <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1, flex:1}} onPress={showStartTime}>
                  <TextInput
                    label="Start Hours"
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
                    label="End Hours"
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
          <View style={styles.row}>
            <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1, flex:1}} onPress={showStartDate}>
              <TextInput
                label="Start Date"
                returnKeyType="next"
                value={startDate.toISOString().substring(0, 10)}
                disabled={true}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={startDateVisible}
              mode="date"
              onConfirm={handleStartDate}
              onCancel={hideStartDate}
            />
            <TouchableOpacity style={{borderBottomColor:theme.colors.grey, borderBottomWidth:1,flex:1}} onPress={showEndDate}>
              <TextInput
                label="End Date"
                returnKeyType="next"
                value={endDate.toISOString().substring(0, 10)}
                disabled={true}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={endDateVisible}
              mode="date"
              onConfirm={handleEndDate}
              onCancel={hideEndDate}
            />
          </View>
          <View style={[styles.row,{marginBottom:16}]}>  
            <Button
              mode="contained"
              style={styles.button}
              onPress={onUpdatePressed}
            >
              Update Showroom
            </Button>
          </View>
          <View style={[styles.row,{marginBottom:16}]}>  
            <Link
              style={{color:theme.colors.danger}}
              onPress={onDeletePressed}
            >
              Delete
            </Link>
          </View>
        </View>
      </BackgroundAuth>
    )
  } else {
    return(
      <BackgroundAuth/>
    )
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:4
  },
  column: {
    flex: 1,
    flexDirection: "column",
    width:'100%'
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
})
