// it's wrong to using like this*******
// check out the app.tsx



/* import React, { useEffect } from 'react';
import { supabase } from './supabase';
import { View, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Create from '../screens/Chat/Create/Create';
import ChatRoomsPage from '../screens/Chat/ChatRooms';
import ChatPage from '../screens/Chat/ChatPage';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Drawer({navigation}:any) {
    const Drawer = createDrawerNavigator();

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
        <Drawer.Navigator initialRouteName="Chat Rooms" screenOptions={{ headerShown: true }}>
            <Drawer.Screen
                name="Chat Rooms"
                component={ChatRoomsPage}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Create')}>
                            <Ionicons name="add" size={30} color="black" style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Drawer.Screen name="Chat" component={ChatPage} />
            <Drawer.Screen name="Create Chat Room" component={Create} />
            <Drawer.Screen name="SignOut" component={SignOutComponent} />
        </Drawer.Navigator>
    );
}

export default Drawer;
*/
