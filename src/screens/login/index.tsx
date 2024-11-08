import React, {useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {useFonts, ShipporiMincho_400Regular} from "@expo-google-fonts/shippori-mincho";
import {supabase} from "../../components/supabase";
import Icon from 'react-native-vector-icons/FontAwesome5';

function LoginPage({navigation}:any) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [hidePass, setHidePass] = React.useState(true);
    const [fontsLoaded] = useFonts({
        ShipporiMincho_400Regular,
    });

    const signIn = async (email:string, password:string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.log('Error signing in:', error.message);
            setError('Kullanıcı adı veya şifre hatalı')
        } else {
            console.log('User signed in:', data);
            setError('');
            navigation.navigate('Drawer');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}> Welcome Back!</Text>
            <View style={styles.items}>
                <View>
                <TextInput style={styles.input}
                           value={email}
                           placeholder='Enter your email'
                           onChangeText={(email) => setEmail(email)}
                           placeholderTextColor='#275475FF'
                           />
                </View>
                <View>
                <TextInput style={styles.input}
                           value={password}
                           placeholder='Password'
                           placeholderTextColor='#275475FF'
                           onChangeText={(password) => setPassword(password)}
                           secureTextEntry={hidePass} />
                    <TouchableOpacity style={styles.icon} onPress={() => setHidePass(!hidePass)}>
                        <Text>
                            <Icon  name={hidePass ? 'eye-slash' : 'eye'} size={20} color='#275475FF' />
                        </Text>
                    </TouchableOpacity>
                </View>
                {<Text style={{fontStyle: 'italic'}}>{error}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => signIn(email,password)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't you have an account? </Text>
                    <TouchableOpacity
                        onPress={() => {navigation.navigate('SignUp')}}
                    >
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    headerText: {
        textAlign: "center",
        fontSize: 35,
        fontFamily: 'ShipporiMincho_400Regular',
        color: '#275475FF',
        marginBottom: 30,

    },
    items: {
        justifyContent: 'center',
        marginHorizontal: 35,
    },
    input: {
        padding: 20,
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#275475FF',
    },
    icon: {
        position: 'absolute',
        right: 20,
        top: 30,
    },
    button:{
        backgroundColor: '#275475FF',
        padding: 18,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    signupText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'ShipporiMincho_400Regular',
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'ShipporiMincho_400Regular',
        color: '#275475FF',
        textDecorationLine: 'underline',
    }

})
