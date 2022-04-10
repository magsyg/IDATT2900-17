import FloatingActionBar from 'react-native-floating-action-bar'

export default function Hoveringbar({ navigation }) {

  const items=[
    {
      icon: 'group',
      id: 1,
      name: 'Team',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'plus-circle',
      id: 2,
      name: 'ArrangementMenu',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'square',
      id: 3,
      name: 'square',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
    {
      icon: 'circle',
      id: 4,
      name: 'Dashboard',
      color: 'rgb(130, 130, 130)',
      activeColor: 'rgb(3, 137, 253)',
      activeBackgroundColor: 'rgb(224, 243, 255)',
    },
  ]

  return (
    <FloatingActionBar
      items={items}
      offset={50}
      onPress={ index => {
        switch (index) {
          case 0:
            //navigation.navigate('Team')
            console.log('Navigate to Team')
            break;
          case 1:
            //navigation.navigate('ArrangementMenu')
            console.log('Navigate to ArrangementMenu')
            break;
          case 2:
            //navigation.navigate('Square')
            console.log('Navigate to Square')
            break;
          case 3:
            //navigation.navigate('Dashboard')
            console.log('Navigate to Dashboard')
            break;
        }
      } }
      position="bottom"
      selectedIndex={3}
/>
  )
}