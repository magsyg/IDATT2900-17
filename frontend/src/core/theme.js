import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, //TODO get correct colors
    text: '#000000',
    primary: '#2d2d2d',
    grey: '#c8c8c8',
    secondary: '#414757',
    link:'#89adec',
    error: '#f13a59',
  },
}
