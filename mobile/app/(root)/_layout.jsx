import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

export default function RootLayout() {
    const {user,isLoaded} = useUser();
    
    if(!isLoaded){
        return null;
    }
    if(!user){
        return <Redirect href={'/sign-in'}/>

    }

    return <Stack screenOptions={{headerShown: false}}/>;
}