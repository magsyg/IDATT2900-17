import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Avatar } from 'react-native-paper'


export default function ProfilePicture({style, size, user}) {
  const [imageURL, setImageUrl] = useState('')
  useEffect(() => {
    if ((typeof user !== 'undefined' && user.profile_picture)) {
      if(user.profile_picture.charAt(0) === '/') {
        setImageUrl(axios.defaults.baseURL+user.profile_picture)
      } else {
        setImageUrl(user.profile_picture)
      }
    }
  
  },[user]);
  return (
    <Avatar.Image 
      style={style}
      size={size} 
      source={(typeof user !== 'undefined' && user.profile_picture) ? {uri:imageURL}: require('../assets/default_profile.png')}  
    />
  )
}