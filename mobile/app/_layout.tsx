import { Slot } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import SafeScreen from "../components/SafeScreen";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar, useColorScheme } from "react-native";
import { use } from "react";


export default function RootLayout() {

const scheme = useColorScheme();
  return <ClerkProvider tokenCache={tokenCache}>
    <SafeScreen>
    
      <Slot /></SafeScreen>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
  </ClerkProvider>
}
