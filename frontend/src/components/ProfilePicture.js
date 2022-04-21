import React, {useEffect, useState} from 'react'

import { Avatar } from 'react-native-paper'
import { baseURL } from '../../config';


export default function ProfilePicture({style, size, user}) {
  const [imageURL, setImageUrl] = useState('')
  useEffect(() => {
    if ((typeof user !== 'undefined' && user.profile_picture)) {
      if(user.profile_picture.charAt(0) === '/') {
        setImageUrl(baseURL+user.profile_picture)
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