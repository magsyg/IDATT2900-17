import React from 'react'
import FloatingActionBar from 'react-native-floating-action-bar'
import {useNavigation, useRoute} from '@react-navigation/native';
import CurrentUserContext from '../../Context';
import HoveringBarBrand from './HoveringBarBrand';
import HoveringBarRetailer from './HoveringBarRetailer';
import { View } from 'react-native';

export default function HoveringBar({}) {
  const { currentUser, checkLogin} = React.useContext(CurrentUserContext);
  if (currentUser.company_type == 'BRAND') {
    return (
      <HoveringBarBrand/>
    )
  } else if (currentUser.company_type == 'RETAILER') {
    return (
      <HoveringBarRetailer/>
    )
  } else {
    return(<View/>)
  }
}