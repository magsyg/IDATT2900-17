import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Tooltip } from 'react-native-elements'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'

export default function TextInput({ errorText, description, tooltip, ...props }) {
    const [focused, setFocused] = useState(false);
    const focus = () => setFocused(true);
    const unFocus = () => setFocused(false);
    return (
      <View style={styles.container}>
        <Input
          style={styles.input}
          selectionColor={theme.colors.primary}
          underlineColor={theme.colors.grey}
          onFocus={focus}
          onBlur={unFocus}
          {...props}
        />
        {description && !errorText && focused? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
})
