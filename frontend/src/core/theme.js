import { DefaultTheme } from 'react-native-paper'

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, //TODO get correct colors
    text: '#000000',
    primary: '#2d2d2d',
    secondary: '#89ADEC',
    grey: '#c8c8c8',
    error: '#f13a59',
  },
}