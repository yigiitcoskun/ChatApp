import React, {useEffect} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatRoomsPage from './src/screens/Chat/ChatRooms';
import ChatPage from './src/screens/Chat/ChatPage';
import Create from './src/screens/Chat/Create/Create';
import SignupPage from "./src/screens/signup/index";
import LoginPage from "./src/screens/login/index";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, View} from 'react-native';
import {supabase} from "./src/components/supabase";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigation({ navigation }: any) {

    const SignOutComponent = () => {
        const SignOut = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                alert('Hata:' + error.message);
                navigation.navigate('Home');
            } else {
                navigation.navigate('Login');
            }
        };

        useEffect(() => {
            SignOut();
        }, []);

        return <View></View>;
    };


    return (
        <Drawer.Navigator initialRouteName="Chat Rooms">
            <Drawer.Screen
                name="Chat Rooms"
                component={ChatRoomsPage}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Create Chat Room')}>
                            <Ionicons name="add" size={30} color="black" style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Drawer.Screen name="Chat" component={ChatPage} />
            <Drawer.Screen name="Create Chat Room" component={Create} />
            <Drawer.Screen name="Sign Out" component={SignOutComponent} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="SignUp" component={SignupPage} />
                <Stack.Screen name="Drawer" component={DrawerNavigation} />
                <Stack.Screen name="Create" component={Create} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
