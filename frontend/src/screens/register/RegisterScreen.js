import React, { useState } from 'react'
import axios from 'axios';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text,  Subheading } from 'react-native-paper'
import Background from '../../components/Background'
import Link from '../../components/Link'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { nameValidator } from '../../helpers/nameValidator'

export default function RegisterScreen({ route, navigation }) {
  const { teamType } = route.params;
  const teamTypeName = {0: "Retailer", 1:"Brand",2:"Multi-label Showroom"}
  const [firstName, setFirstName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: '' })
  const [company, setCompany] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' })

  
  const registerRequest = () => {
    const payload = { 
        teamType:teamType,
        name: company.value,
        email: email.value,
        first_name:firstName.value,
        last_name:lastName.value,
        password: password.value, 
        password2: password.value, 
      } 
    console.log(payload)
    axios
      .post(`/accounts/register/newcompany`, payload)
      .then(response => {
        const { token, user } = response.data;
        console.log(response.data)
        // We set the returned token as the default authorization header
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        // Navigate to the home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
      })
      .catch(function (error) {
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
  const onRegisterPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    registerRequest()
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header style={{marginBottom:0,textAlign:'center'}}>Welcome To Gleu</Header>
      <Subheading style={{marginTop:0,textAlign:'center'}}>We're so happy you are here</Subheading>
      <Text style={styles.teamText}>Registering as {teamTypeName[teamType]}</Text>
      <TextInput
        label="Company/Shop name"
        returnKeyType="next"
        value={company.value}
        onChangeText={(text) => setCompany({ value: text, error: '' })}
        error={!!company.error}
        errorText={company.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstName.value}
        onChangeText={(text) => setFirstName({ value: text, error: '' })}
        error={!!firstName.error}
        errorText={firstName.error}
      />
        <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={(text) => setLastName({ value: text, error: '' })}
        error={!!lastName.error}
        errorText={lastName.error}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onRegisterPressed}
        style={styles.button}
      >
        Sign Up
      </Button>
      <View style={[styles.row,{marginBottom:6}]}>
        <Text>By signing up you agree to our </Text>
        <Link onPress={() => navigation.replace('LoginScreen')}>Terms and conditions</Link>
      </View>
      <View style={[styles.row,{marginBottom:12}]}>
        <Text>Already have an account? </Text>
        <Link onPress={() => navigation.replace('LoginScreen')}>Login</Link>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
  teamText: {
    fontSize: 17,
    fontWeight: 'bold',
    color:theme.colors.secondary,
    marginVertical: 6,
  }
})
