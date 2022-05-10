import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Subheading, IconButton, Searchbar, Avatar } from 'react-native-paper'
import Background from '../../../components/Background'
import TextInput from '../../../components/TextInput'
import OptionTextLink from '../../../components/OptionTextLink'
import Header from '../../../components/Header'
import BackButton from '../../../components/BackButton'
import Button from '../../../components/Button'
import { theme } from '../../../core/theme'
import ProfilePicture from '../../../components/ProfilePicture';
import PillLink from '../../../components/PillLink';
import OutlinedButton from '../../../components/OutlinedButton';
import Paragraph from '../../../components/Paragraph';
import PhoneNumberInput from '../../../components/PhoneNumberInput';
import BackgroundAuth from '../../../components/BackgroundAuth';
import CurrentUserContext from '../../../../Context';
import api from '../../../../api';
import BackHeader from '../../../components/BackHeader';

export default function SettingsProfileScreen({ route, navigation }) {
  const { currentUser, authIsLoading } = React.useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: '' })
  const [countryCode, setCountryCode] = useState({ value: '+47', error: '' })
  const [phoneNumber, setPhoneNumber] = useState({ value: '', error: '' })
  const [user, setUser] = useState({})
  const [profilePicture, setProfilePicture] = useState(null);
  
  // Success modal
  const [successModal, setSuccessModal] = useState(false);
  const hideSuccessModal = () => setSuccessModal(false);

  // Profile Picture
  const [PPModalVisible, setPPModalVisible] = useState(false);
  const showPPModal = () => setPPModalVisible(true);
  const hidePPModal = () => setPPModalVisible(false);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);
    if (!result.cancelled) {
      setProfilePicture(result);
    }
  };

  const getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
}, new FormData());

  const updateProfilePicture = () => {
    // TODO Find out how this works
    var imageType = profilePicture.uri.split('.')
    imageType = imageType[imageType.length-1]
    var imageName = profilePicture.uri.split('/')
    imageName = imageName[imageName.length-1].split('.')[0]

    var data = new FormData();

    data.append("profile_picture", {filename:imageName, type:imageType, uri: profilePicture.uri})
    api.put('/accounts/profile/update/', getFormData(data), {   
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }).then((response) => {
      setUser(response.data)
      console.log(response.data)
    }).catch(function (error) {
      
      console.log(error.response.data)
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
      
    });
  }
  useEffect(() => {
    api.get('/accounts/current_user/').then((response) => {
      setUser(response.data.user)
      setFirstName({value: response.data.user.first_name, error:""})
      setLastName({value: response.data.user.last_name, error:""})
      setCountryCode({value: "+"+response.data.user.country_code.toString(), error:""})
      setPhoneNumber({value: response.data.user.national_number.toString(), error:""})
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
  }, []);

  const nextScreen = () => {
    setSuccessModal(false);
    navigation.goBack();
  }

  const onUpdatePressed = () => {
    const payload = {
      first_name: firstName.value,
      last_name: lastName.value,
      phone_number: countryCode.value+phoneNumber.value

    }
    console.log(payload)
    api.put('/accounts/profile/update/', payload).then((response) => {
      console.log(response.data)
      setFirstName({value: response.data.first_name, error:""})
      setLastName({value: response.data.last_name, error:""})
      setCountryCode({value: "+"+response.data.country_code.toString(), error:""})
      setPhoneNumber({value: response.data.national_number.toString(), error:""})
      setSuccessModal(true);
    }).catch(function (error) {
      
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
      
    });
  }
  if (!authIsLoading && currentUser !== null) {
    return (
      <BackgroundAuth>
        <BackHeader goBack={navigation.goBack}>
          <Subheading style={{color:theme.colors.grey}}>
            Edit Profile
          </Subheading>
        </BackHeader>
        <View style={styles.column}>
          <Modal visible={successModal}>
          <TouchableOpacity  style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={nextScreen}>
            <Subheading style={{textAlign:'center', fontSize:18}}>User updated successfully!</Subheading>
            <Paragraph style={{textAlign:'center', color:theme.colors.grey}}>
              Click anywhere to return
            </Paragraph>
          </TouchableOpacity>
        </Modal>
        
        <Modal visible={PPModalVisible} onDismiss={hidePPModal}>
          <View style={styles.column}>
            <View style={[styles.row, {flex:0,justifyContent:'flex-end',marginHorizontal: 32, marginTop:24, marginBottom:0}]}>
              <IconButton icon="close" size={30} color={theme.colors.grey} onPress={hidePPModal}></IconButton>
            </View>
            <View style={styles.row}>
              {profilePicture ? 
              <Avatar.Image 
                size={256} 
                source={{ uri: profilePicture.uri }}
              />:
              <ProfilePicture
                size={256} 
                user={user}
              />
              }

            </View>
            <View style={styles.row}>
              <OutlinedButton onPress={pickImage}>Select New Image</OutlinedButton>
            </View>
            <View style={{margin:32}}>
              {profilePicture &&
                <Button onPress={updateProfilePicture}>Update Profile Picture</Button>
              }
            </View>
          </View>
        </Modal>
          <View style={{flex:1}}>
            <View>
              <View style={styles.row}>
                  <ProfilePicture
                    size={96} 
                    user={user}
                  />
              </View>
              <PillLink onPress={showPPModal} style={{flex:0}}>Edit</PillLink>
            </View>
            <View style={[styles.row, {margin:4}]}>
              <Subheading style={{color:theme.colors.primary}}>
                {user.email}
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
                tooltip={'hello'}
              />
            </View>
            <PhoneNumberInput 
              phoneNumber={phoneNumber} 
              setPhoneNumber={setPhoneNumber}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              />
            
            
          </View>
          <View style={[styles.row,{marginBottom:16}]}>  
            <Button
              mode="contained"
              onPress={onUpdatePressed}
            >
              Update Profile
            </Button>
          </View>
        </View>
      </BackgroundAuth>
    ) 
  } else {
    return <BackgroundAuth/>
  }
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
    width:'100%',
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
})
