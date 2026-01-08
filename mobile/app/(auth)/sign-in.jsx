import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '../../assets/styles/auth.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error,setError]=React.useState("")
  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if(err.errors?.[0]?.code==="form_password_incorrect"){
        setError("Incorrect password. Please try again.")
      }else{
        setError("Failed to sign in. Try again later.")
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={150}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/images/Revenue Chart.png')} style={styles.illustration} />

        {
            error?
            <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={()=>setError("")}>
                    <Ionicons name="close" size={16} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
            :null
        }


      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={COLORS.textLight}

        style={styles.input}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <>
        <Text style={styles.footerText}>Don't have an account?</Text>
        </>
        <Link href="/sign-up">
        
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </View>
    </KeyboardAwareScrollView>
  )
}