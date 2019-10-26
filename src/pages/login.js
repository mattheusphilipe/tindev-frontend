import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import logo from '../assets/logo.png';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

const Login = ({navigation}) => {
  const [user, setUser] = useState('');

  const onChangeText = (e) => {
    setUser(e.toString());
  };

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      const {navigate} = navigation;
    
      console.log(user, 26);
      if (user) {
        navigate('Main', {user});
      }
    });

  }, []);


  const handleLogin = async () => {
    // em classe não precisa escrever function
    console.log(user);

    const response = await api.post('/devs', {username: user});
    console.log(response.data);
    const {_id, avatar} = response.data;

    await AsyncStorage.setItem('user', _id);
    await AsyncStorage.setItem('avatar', avatar);

    navigation.navigate('Main', {user: _id});
  };

  return (
    <KeyboardAvoidingView // impedir que no ios o teclado fique por cima do conteudo
      style={styles.container}
      behavior="padding"
      enabled={Platform.OS === 'ios'}>
      <Image source={logo} />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#999"
        style={styles.input}
        placeholder="Digite seu usuário no Github!"
        value={user}
        onChangeText={onChangeText}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
  </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  button: {
    height: 46,
    alignSelf: 'stretch', // toda largura possível
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    backgroundColor: '#DF4723',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;
