import * as React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('');
  const [error,setError]=React.useState("")

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      if(err.errors?.[0]?.code==="form_identifier_exits"){
        setError("An account with this email already exists.")
      }else if(err.errors?.[0]?.code==="form_password_too_weak"){
        setError("Password is too weak. Please choose a stronger password.")

      }else{
        setError("Failed to sign up. Try again later.")
      }
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>


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


        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          style={[styles.verificationInput,error && styles.errorInput]}
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView style={{flex:1}}
    enableAutomaticScroll={true}
    enableOnAndroid={true}
    contentContainerStyle={{flexGrow:1}}
    extraScrollHeight={150}
    >
      <View style={styles.container}>
        <Image source={require('../../assets/images/Revenue Chart.png')} style={styles.illustration} />
      
        <Text style={styles.title}>Create Account</Text>
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
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          style={styles.input}
          onChangeText={(email) => setEmailAddress(email)}
          placeholderTextColor={COLORS.textLight}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(password) => setPassword(password)}
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={[{ display: 'flex', flexDirection: 'row', gap: 3 },styles.footerContainer]}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.linkText}>Sign in</Text>
          </Link>
        </View>
        </View>
    </KeyboardAwareScrollView>
  )
}