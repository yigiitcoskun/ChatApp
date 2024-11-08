import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {supabase} from '../../components/supabase'


function ChatRoomsPage({navigation}:any) {
    const [rooms, setRooms] = useState([]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Gün: 01-31
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ay: 01-12
        const year = date.getFullYear(); // Yıl: 2024 vb.

        return `${day}.${month}.${year}`;
    };


    const getRooms = async () => {
        const {data, error} = await supabase
            .from('chat_rooms')
            .select()
            .order('created_at', { ascending: false });
        if (error) {
            console.error(error)
            return;
        }
        if(data){
            // @ts-ignore
            setRooms(data);

        } else {
            console.log('Not Found');
        }

    }

    const subscribeToNewRooms = () => {
        supabase
            .channel('public:chat_rooms')
            .on(
                'postgres_changes',
                {event: 'INSERT', schema: 'public', table: 'chat_rooms'},
                (payload) => {
                    const newRoom = payload.new;
                    setRooms((prevRooms: any):any => [newRoom, ...prevRooms]);
                }
            )
            .subscribe();
    };

    const _renderItem = ({item}:any) => {
        return (
            <TouchableOpacity
                style={styles.listContainer}
                onPress={() => navigation.navigate('Chat', { roomName: item.room_name, roomID: item.id})}>
            <Text style={styles.roomName}>
                        {item.room_name}
                    </Text>
                <View style={styles.items}>
                    <Text style={styles.creatorName}>
                        Oluşturan: {item.creator_display_name}
                    </Text>

                    <Text style={styles.createdAt}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>
            </TouchableOpacity>

        )
    }



    useEffect(() => {
        getRooms();
        console.log(rooms)
        subscribeToNewRooms();
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                data={rooms}
                keyExtractor={(item:any):any => item.id.toString()}
                renderItem={_renderItem} />
        </View>
    );
}

export default ChatRoomsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    listContainer: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        marginHorizontal: 30,
        marginVertical: 10,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#275475FF',
    },
    roomName: {
        fontSize: 20,
        fontWeight: '500',
        color: '#275475FF',
    },
    creatorName: {
        fontSize: 15,
        fontWeight: '400',
        opacity: 0.6
    },
    items: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
    },
    createdAt: {
        fontSize: 13,
        opacity: 0.6
    }
})
