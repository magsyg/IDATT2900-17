import React, {useEffect} from 'react'
import axios from 'axios'
import { Avatar } from 'react-native-paper'


export default function ProfilePicture({style, size, user}) {
  useEffect(() => {console.log(axios.defaults.baseURL+user.profile_picture)},[user]);
  return (
    <Avatar.Image 
      style={style}
      size={size} 
      source={user.profile_picture ? {uri:axios.defaults.baseURL+user.profile_picture}: require('../assets/default_profile.png')}  
    />
  )
}