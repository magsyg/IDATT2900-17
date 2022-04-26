import React, { useState } from 'react'
import axios from 'axios';
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../../components/Background'
import Logo from '../../../components/Logo'
import Header from '../../../components/Header'
import HeaderLine from '../../../components/HeaderLine'
import Button from '../../../components/Button'
import TextInput from '../../../components/TextInput'
import BackButton from '../../../components/BackButton'
import { theme } from '../../../core/theme'
import { emailValidator } from '../../../helpers/emailValidator'
import { passwordValidator } from '../../../helpers/passwordValidator'
import api from '../../../../api';
import CurrentUserContext from '../../../../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { checkLogin } = React.useContext(CurrentUserContext);
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' });

  
  const loginRequest = async() => {
    const payload = { username: email.value, password: password.value } 
    try {
      const { data } = await api.post(`/accounts/api-token-auth/`, payload)
      try {
        await AsyncStorage.setItem('@key', `Token ${data.token}`)
      } catch (e) {
        console.log(e);
      }

      checkLogin();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      })

    } catch (error) {
      console.log(error);
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        if (error.response.data.hasOwnProperty("non_field_errors")) {
          setEmail({error:error.response.data["non_field_errors"][0]})
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
    }

    /**
     *         axios.defaults.headers.common.Authorization = `Token ${token}`;
        try {
          await AsyncStorage.setItem('@key', `Token ${token}`)
        } catch (e) {
          // saving error
        }
        // Navigate to the home screen
        console.log("Success!")
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        })
        console.log("Success!")
     */
  }
  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    loginRequest()
  }

  return (
    <Background>
      <Header>Hello There</Header>
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
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" style = {styles.button}  onPress={onLoginPressed}>
        Sign In
      </Button>
      <HeaderLine>Or</HeaderLine>
      <Button mode="contained" style = {styles.button} onPress={() => navigation.navigate('Register')}>
        Create Account
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  }
})
