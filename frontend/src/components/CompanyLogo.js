import React, {useEffect, useState} from 'react'

import { Avatar } from 'react-native-paper'
import { baseURL } from '../../config';


export default function CompanyLogo({style, size, company}) {
  const [imageURL, setImageUrl] = useState('')
  useEffect(() => {
    if ((typeof company !== 'undefined' && company.logo)) {
      if(company.logo.charAt(0) === '/') {
        setImageUrl(baseURL+company.logo);
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