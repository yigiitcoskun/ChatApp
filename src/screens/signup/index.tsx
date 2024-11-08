import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {supabase} from '../../components/supabase'
import Icon from "react-native-vector-icons/FontAwesome5";

export default function SignupPage({navigation}:any) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = useState('');
    const [hidePass, setHidePass] = useState(true);


    const signUp = async (email:string, password:string, name:string) => {
        if (!name || name.trim() === '') {
            setError('İsim kısmı boş bırakılamaz');
            return;
        }


        const { data: authData, error: authError } = await supabase.auth.signUp({
            options: {
                data: {
                    display_name: name
                }
            },
            email: email,
            password: password,
        });

        if (authError) {
            console.log('Error signing up:', authError.message);
            handleAuthError(authError);
        } else {
            console.log('User signed up:', authData);
            setError('');
            navigation.navigate('Login');
        }
    };

    const handleAuthError = (error:any) => {

        switch (error.message) {
            case 'Unable to validate email address: invalid format':
                setError('Lütfen geçerli bir E-Posta adresi girin.');
                break;
            case 'Password is too weak':
                setError('Şifreniz çok zayıf, lütfen daha güçlü bir şifre seçin.');
                break;
            case 'User already registered':
                setError('Bu e-posta adresiyle bir kullanıcı zaten kayıtlı.');
                break;
            case 'Password should be at least 6 characters.':
                setError('Şifre en az 6 karakter olmalıdır');
                break;
            default:
                setError('Bir hata oluştu. Lütfen tekrar deneyin.');
                break;
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.headerText}> Get Started</Text>
            <View style={styles.items}>
                <View>
                    <TextInput style={styles.input}
                               value={name}
                               placeholder='Enter your name'
                               onChangeText={(name) => setName(name)}
                               placeholderTextColor='#275475FF'
                    />
                </View>
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
                    onPress={() => signUp(email,password, name)}
                >
                    <Text style={styles.buttonText}>SignUp</Text>
                </TouchableOpacity>
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>If you have an account? </Text>
                    <TouchableOpacity
                        onPress={() => {navigation.navigate('Login')}}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
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
    icon:{
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    loginText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'ShipporiMincho_400Regular',
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '300',
        fontFamily: 'ShipporiMincho_400Regular',
        color: '#275475FF',
        textDecorationLine: 'underline',
    }

})

