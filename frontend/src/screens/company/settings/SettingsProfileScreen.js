import React, { useState, useEffect } from 'react'
import axios from 'axios'
import filter from 'lodash.filter';
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import { Avatar, Subheading, IconButton, Searchbar } from 'react-native-paper'
import Background from '../../../components/Background'
import TextInput from '../../../components/TextInput'
import OptionTextLink from '../../../components/OptionTextLink'
import Header from '../../../components/Header'
import BackButton from '../../../components/BackButton'
import Button from '../../../components/Button'
import { theme } from '../../../core/theme'
import { countryCodes } from '../../../core/countrycodes'

export default function SettingsProfileScreen({ route, navigation }) {
  const [email, setEmail] = React.useState('ms@gmail.com');
  const [firstName, setFirstName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: '' })
  const [countryCode, setCountryCode] = useState({ value: '+47', error: '' })
  const [phoneNumber, setPhoneNumber] = useState({ value: '', error: '' })



  const [CCvisible, setCCVisible] = React.useState(false);
  const [CCData, setCCData] = React.useState(countryCodes);
  const showCCModal = () => setCCVisible(true);
  const hideCCModal = () => setCCVisible(false);

  const updateCountryCode = (code) => {
    setCountryCode({value:code, error: ''});
    hideCCModal();
  }

  const [searchCC, setSearchCC] = React.useState('');
  const onChangeSearchCC = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(countryCodes, CC => {
      return contains(CC, formattedQuery);
    });
    setCCData(filteredData);
    setSearchCC(text)
  };
  
  const contains = ({ name, dial_code }, query) => {
    if (name.toLowerCase().includes(query) || dial_code.includes(query)) {
      return true;
    }
  
    return false;
  };

  useEffect(() => {
    axios.get('/accounts/current_user/').then((response) => {
      setFirstName({value: response.data.first_name, error:""})
      setLastName({value: response.data.last_name, error:""})
      setCountryCode({value: "+"+response.data.country_code.toString(), error:""})
      setPhoneNumber({value: response.data.national_number.toString(), error:""})
      setEmail(response.data.email)
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

  const onUpdatePressed = () => {
    const payload = {
      first_name: firstName.value,
      last_name: lastName.value,
      phone_number: countryCode.value+phoneNumber.value

    }
    console.log(payload)
    axios.put('/accounts/profile/update/', payload).then((response) => {
      console.log(response.data)
      setFirstName({value: response.data.first_name, error:""})
      setLastName({value: response.data.last_name, error:""})
      setCountryCode({value: "+"+response.data.country_code.toString(), error:""})
      setPhoneNumber({value: response.data.national_number.toString(), error:""})

    })  .catch(function (error) {
      console.log("-----axios----")
      if (error.response) {
        if (error.response.data.hasOwnProperty("phone_number")) {
          setPhoneNumber({error: error.response.data.phone_number[0]})
        }
        if (error.response.data.hasOwnProperty("first_name")) {
          setPhoneNumber({error: error.response.data.first_name[0]})
        }
        if (error.response.data.hasOwnProperty("last_name")) {
          setPhoneNumber({error: error.response.data.last_name[0]})
        }
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
      <Modal visible={CCvisible} onDismiss={hideCCModal}>
        <View style={[styles.row, {marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
          <View style={{flex:1}}>
            <Searchbar placeholder="Search"       
            onChangeText={onChangeSearchCC}
            value={searchCC}
            style={{backgroundColor:theme.colors.grey, borderRadius:100}}
            />
          </View>
          <IconButton icon="close" size={30} color={theme.colors.primary} onPress={hideCCModal}></IconButton>
        </View>
        <View style={{paddingHorizontal:16}}>
        <FlatList
            data={CCData}
            numColumns={1}
            contentContainerStyle={{marginHorizontal:16}}
            renderItem={({item, index}) => 
              <OptionTextLink  key={item.dial_code} onPress={()=>updateCountryCode(item.dial_code)} text1={item.name} text2={item.dial_code}/>
            }                             
        />
        </View>
      </Modal>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.column}>
        <View style={[{flex:1,  marginVertical:16}]}>
          <View style={styles.row}>
            <Header>Profile</Header>
          </View>
          <View style={styles.row}>
            <Avatar.Image 
                  size={96} 
                  source={require('../../../assets/default_profile.png')}  
            />
          </View>
          <View style={[styles.row, {margin:4}]}>
            <Subheading style={{color:theme.colors.secondary}}>
              {email}
            </Subheading>
          </View>
        </View>
        <View style={{flex:3, marginTop:16}}>
          <View style={styles.row}>  
            <TextInput
              label="First Name"
              returnKeyType="next"
              value={firstName.value}
              onChangeText={(text) => setFirstName({ value: text, error: '' })}
              error={!!firstName.error}
              errorText={firstName.error}
            />
          </View>
          <View style={styles.row}>  

            <TextInput
              label="Last Name"
              returnKeyType="next"
              value={lastName.value}
              onChangeText={(text) => setLastName({ value: text, error: '' })}
              error={!!lastName.error}
              errorText={lastName.error}
            />
          </View>
          <View style={styles.row}>  
            <TouchableOpacity style={{marginTop: 30}} onPress={showCCModal}>
              <Text style={{color:theme.colors.secondary}}>{countryCode.value}</Text>
            </TouchableOpacity>
            <TextInput
              label="Phone Number"
              returnKeyType="next"
              value={phoneNumber.value}
              onChangeText={(text) => setPhoneNumber({ value: text, error: '' })}
              error={!!phoneNumber.error}
              errorText={phoneNumber.error}
            />
          </View>
          
        </View>
        <View style={[styles.row,{marginBottom:16}]}>  
          <Button
            mode="contained"
            style={styles.button}
            onPress={onUpdatePressed}
          >
            Update Profile
          </Button>
        </View>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent:'center',
    marginTop: 4,
  },
  column: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center'
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
})
