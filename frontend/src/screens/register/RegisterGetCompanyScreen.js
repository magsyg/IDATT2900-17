import React, { useState } from 'react'
import axios from 'axios';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Subheading } from 'react-native-paper'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import Paragraph from '../../components/Paragraph'
import Dropdown from '../../components/Dropdown'
import Link from '../../components/Link'

export default function RegisterGetCompanyScreen({ route, navigation }) {
  const [companyCode, setCompanyCode] = useState({ value: '', error: '' })

  const onJoinPressed = () => {
    const payload = { 
        company_code:companyCode.value
      } 
    console.log(payload)
    axios
      .post(`/companies/code/`, payload)
      .then(response => {
        navigation.navigate('RegisterScreen', {
          companyCode:companyCode.value,
          companyName:response.data.company_name,
          companyID:response.data.company_id
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
        setCompanyCode({value:companyCode.value, error:'No company found with that code'})
      });
    }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.column}>
        <View style={[{flex:1, marginTop:32}]}>
          <Header style={{textAlign:'center'}}>Join an existing company</Header>
          <Subheading style={{textAlign:'center'}}>Use the activation code given by the company</Subheading>

          <TextInput
            label="Activation code"
            returnKeyType="next"
            value={companyCode.value}
            onChangeText={(text) => setCompanyCode({ value: text, error: '' })}
            error={!!companyCode.error}
            errorText={companyCode.error}
          />
          <Button
            mode="contained"
            onPress={onJoinPressed}
            style={styles.button}
          >
            Join Company
          </Button>
        </View>
        <View style={[styles.row,{marginBottom:12}]}>
          <Text>Already have an account? </Text>
          <Link onPress={() => navigation.replace('LoginScreen')}>Login</Link>
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
  link: {
    fontWeight: 'bold',
    color: theme.colors.link,
  },
  button: {
    backgroundColor: theme.colors.grey,
    color: theme.colors.primary
  },
})
