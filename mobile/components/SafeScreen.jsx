import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {COLORS} from '../constants/colors';

export default function SafeScreen({children}) {

    const insets = useSafeAreaInsets();

  return (
    <View style={{flex:1,paddingTop:insets.top,backgroundColor:COLORS.backgroundColor}}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({})