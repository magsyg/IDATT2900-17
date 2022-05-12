import React, {useEffect, useState} from 'react'
import FloatingActionBar from './navbar/FloatingActionBar';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import CurrentUserContext from '../../Context';

export default function HoveringBarRetailer({}) {
  const { currentUser, checkLogin} = React.useContext(CurrentUserContext);
  const [page, setPage] = useState(3);
  const navigation = useNavigation();
  const route = useRoute();
  const items=[
    {
      icon: 'group',
      id: 0,
      name: 'Team',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'plus-circle',
      id: 1,
      name: 'Appointment',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'square',
      id: 2,
      name: 'square',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'circle',
      id: 3,
      name: 'Dashboard',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
  ]

  const isFocused = useIsFocused(); //method for determining if the screen is entered
  useEffect(() => {
    // Trigger only on enter
    const ap_create_screens = ["AppointmentCreateSelect","AppointmentCreateShowroomSearchScreen","AppointmentCreateForm"]
    if (isFocused) {
       if (route.name === 'Dashboard')
        { 
        setPage(3)
        } 
      else if (route.name === 'Calendar') 
      {
        setPage(2);
      }
      else if (ap_create_screens.includes(route.name)) {
        setPage(1);
      }
      else if (route.name === 'CompanyContacts') 
      {
        setPage(0);
      }  else {
        setPage(-1);
      }
    }
  }, [isFocused]);

  const selectIndex = (index) => {
    switch (index) {
      case 0:
        //navigation.navigate('Team')
        navigation.navigate('Contacts');
        break;
      case 1:
        navigation.navigate('AppointmentCreate')
        break;
      case 2:
        navigation.navigate('Calendar')
        break;
      case 3:
        navigation.navigate('Dashboard')
        break;
    }
  }
  return (
    <FloatingActionBar
      items={items}
      offset={10}
      onPress={(index) => selectIndex(index)}
      position="bottom"
      selectedIndex={page}
/>
  )
}