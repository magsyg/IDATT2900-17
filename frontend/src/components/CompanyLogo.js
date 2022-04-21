import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Avatar } from 'react-native-paper'


export default function CompanyLogo({style, size, company}) {
  const [imageURL, setImageUrl] = useState('')
  useEffect(() => {
    if ((typeof company !== 'undefined' && company.logo)) {
      if(company.logo.charAt(0) === '/') {
        setImageUrl(axios.defaults.baseURL+company.logo);
      } else {
        setImageUrl(company.logo);
      }
    }
  
  }, [company]);
  return (
    <Avatar.Image 
      style={style}
      size={size} 
      source={(typeof company !== 'undefined' && company.logo) ? {uri:imageURL}: require('../assets/default_logo.png')}  
    />
  )
}