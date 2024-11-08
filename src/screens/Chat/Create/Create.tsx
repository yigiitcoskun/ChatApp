import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, Keyboard} from 'react-native';
import {supabase} from '../../../components/supabase'


function Create({ navigation }:any) {
    const [roomName, setRoomName] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');


    const createChatRoom = async (roomName: string, userId: string, displayName: string) => {
        const {data, error} = await supabase
            .from('chat_rooms')
            .insert([
                {
                    room_name: roomName,
                    creator_id: userId,
                    creator_display_name: displayName,
                },
            ]) .select();
        if (error) {
            console.error('Error creating chat room:', error.message);
            return {error};
        }

        console.log('Chat room created:', data);
        return {data};

    }

    const handleCreateRoom = async () => {
        const user = await supabase.auth.getUser();
        if (!roomName) {
            setError('Lütfen Oda Adı Giriniz');
            return;
        }
        if (!user?.data?.user) {
            console.error('Kullanıcı oturumu yok');
            return;
        }
        const{error: createRoomError} = await createChatRoom(
            roomName,
            user.data.user.id,
            user.data.user.user_metadata.display_name
        )
        if (createRoomError) {
            setError(createRoomError.message);
        } else {
            setError('');
            setRoomName('')
            navigation.navigate('Chat Rooms');
        }
    }


        return (
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.items}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Create New Room</Text>
            </View>
            <TextInput
                placeholder={'Room Name'}
                value={roomName}
                onChangeText={(name) => setRoomName(name)}
                style={styles.input}
                />
                {error && <View style={{justifyContent:'flex-end', alignItems:'flex-end', paddingTop:10, paddingRight:5}}><Text style={{fontStyle:'italic'}}>{error}</Text></View>}
            <View>
                <TouchableOpacity style={styles.button} onPress={() => handleCreateRoom()}>
                    <Text style={{fontSize:20, color:'#fff', textAlign:'center'}}>Create</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
            </Pressable>
    );
}

export default Create;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    items:{
        marginHorizontal: 40,
    },
    input:{
        padding: 20,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#275475FF',
        backgroundColor: '#fff',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    headerText: {
        fontSize: 30,
        fontWeight: '400',
        fontFamily: 'ShipporiMincho_400Regular',
        color: '#275475FF',
    },
    button: {
        backgroundColor: '#275475FF',
        padding: 18,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40
    }
})
