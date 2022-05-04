import React from 'react'
import FloatingActionBar from 'react-native-floating-action-bar'
import {useNavigation} from '@react-navigation/native';
import CurrentUserContext from '../../Context';

export default function HoveringBarBrand({}) {
  const { currentUser, checkLogin} = React.useContext(CurrentUserContext);
  const navigation = useNavigation();
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
      icon: 'square',
      id: 1,
      name: 'square',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'circle',
      id: 2,
      name: 'Dashboard',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
  ]
  
  return (
    <FloatingActionBar
      items={items}
      offset={10}
      onPress={ index => {
        switch (index) {
          case 0:
            //navigation.navigate('Team')
            navigation.navigate('Contacts');
            console.log('Navigate to Contacts');
            break;
          case 1:
            navigation.navigate('Calendar')
            console.log('Navigate to Calendar')
            break;
          case 2:
            navigation.navigate('Dashboard')
            console.log('Navigate to Dashboard')
            break;
        }
      } }
      position="bottom"
      selectedIndex={2}
/>
  )
}