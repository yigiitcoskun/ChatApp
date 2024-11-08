import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, KeyboardAvoidingView,Platform, ScrollView, Keyboard} from 'react-native';
import {supabase} from "../../components/supabase";
import Icon from "react-native-vector-icons/Ionicons";


function ChatPage({ route, navigation }: any) {
    const { roomName } = route.params || 'Chat' ;
    const { roomID } = route.params || {};
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);

    const sendMessage = async () => {
        const user = await supabase.auth.getUser();

        if(!message){
            return;
        }
        if(!user?.data?.user){
            alert('Lütfen Giriş Yapınız');
            return;
        }
        const {error} = await supabase.from('messages')
            .insert([
                {
                 room_id: roomID,
                 user_id: user?.data?.user.id,
                 user_name: user.data.user.user_metadata.display_name,
                 message
                }
                ]);
        if(error){
            console.error('mesaj gönderilemedi: ', error.message);
        } else {
            console.log('mesaj gönderildi');
            setMessage('');
            Keyboard.dismiss();
        }
    }

    const fetchMessages = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // @ts-ignore
        setUserId(user?.id);
        const { data, error } = await supabase
            .from('messages')
            .select('id, user_name, message, created_at, user_id')
            .eq('room_id', roomID)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Mesajlar alınamadı:', error.message);
            return;
        }
        // @ts-ignore
        setMessages(data);
    };

    const subscribeToNewMessages = () => {
        const channel = supabase
            .channel(`messages:room_id=eq.${roomID}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new;
                    setMessages((prevMessages):any => [...prevMessages, newMessage]);
                }
            )
            .subscribe();

        return channel;
    };


    const _renderItem = ({ item }:any) => {
        const isCurrentUser = item.user_id === userId;
        return (
            <View style={[
                styles.messageContainer,
                isCurrentUser ? styles.messageRight : styles.messageLeft
            ]}>
                {!isCurrentUser && <Text style={styles.userName}>{item.user_name}</Text>}
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.timestamp}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
            </View>
        )
    }



    useEffect(() => {
        navigation.setOptions({
            headerTitle: roomName,
        });
        if(!roomID) {
            navigation.goBack();
            return;
        }
        fetchMessages();
        const channel = subscribeToNewMessages();

        return () => {
            if (channel) {
                channel.unsubscribe();
            }
        };

    }, [navigation, roomName, roomID]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView
                ref={ref => {this.scrollView = ref}}
                onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                style={styles.messages}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}>
                <FlatList
                    data={messages}
                    renderItem={_renderItem}
                    //@ts-ignore
                    keyExtractor={(item) => item.id.toString()}
                />
            </ScrollView>
            <View style={styles.inputarea}>
                <TextInput
                    style={styles.input}
                    placeholder='Mesajı buraya yaz'
                    value={message}
                    onChangeText={(message) => setMessage(message)}
                />
                <TouchableOpacity onPress={() => sendMessage()}><Icon name='send' size={22} color='green'/></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default ChatPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messages: {
        flex:1,
        backgroundColor: '#fff',
    },
    inputarea: {
        backgroundColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 20,
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: 330,
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    messageContainer: {
        marginBottom: 15,
        marginLeft: 13,
        padding: 12,
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        maxWidth: 260,
        minWidth: 130,
    },
    messageRight: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1f7d1',
        marginRight:13,
    },
    messageLeft: {
        alignSelf: 'flex-start',
        backgroundColor: '#f1f1f1',
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
        color: '#777',
        textAlign: 'right',
    },

})
