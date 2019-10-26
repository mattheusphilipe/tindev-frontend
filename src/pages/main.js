import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
import api from '../services/api';
import io from 'socket.io-client';

export default function Main({navigation}) {
  const id = navigation.getParam('user');
  const [urlProfile, setUrlProfile] = useState('https://avatars2.githubusercontent.com/u/24270334?v=4');
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });
      setUsers(response.data);
    }

    async function profilePic() {

     await AsyncStorage.getItem('avatar')
        .then(avatar => {
          setUrlProfile(avatar);
        })
        .catch(e => console.error(e));
    }
    profilePic();
    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = io(
      'http://ec2-18-220-27-44.us-east-2.compute.amazonaws.com:3333',
      //'http://localhost:3333',
      {
        query: {user: id},
      },
    );

    setTimeout(() => {
      socket.emit('hello', {
        message: 'Hello Bitches!',
      });
    }, 3000);

    socket.on('match', dev => {
      setMatchDev(dev);
    });
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users; //  pega o primeiro e o restante do array está em rest === users.filter(user => user['_id'] !== id)
    console.log(user['_id'], 'linha 45');

    await api
      .post(`/devs/${user['_id']}/likes`, null, {
        headers: {user: id},
      })
      .then(e => {
        console.log(e.data, 'linha 53');
      })
      .catch((e) => console.log(e, 'linha 57'));

    setUsers(rest);
  }


  async function handleDislike() {
    const [user, ...rest] = users; //  pega o primeiro e o restante do array está em rest
    console.log(user['_id'], 'linha 54')

    await api.post(`/devs/${user['_id']}/dislikes`, null, {
        headers: {user: id},
      })
      .then(e => {
        console.log(e.data, 'linha 53');
      })
      .catch((e) => console.log(e, 'linha 57'));
    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.topBar}>
       <TouchableOpacity style={styles.profilePic}>
          <Image style={styles.profilePic} source={{uri: urlProfile}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {users.length === 0
          ? <Text style={styles.empty}>Acabou :( </Text>
          : users.map((user, index) => {
            return (
            <View
                key={user._id}
                style={[styles.cards, {zIndex: users.length - index}]}>
                <Image style={styles.avatar} source={{uri: user.avatar}} />

                <View style={styles.footer}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                  </Text>
                </View>
              </View>
            );
         })
        }

        </View>

     
      {users.length > 0 && (
          <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
        )
      }

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image stle={styles.matchImage} source={itsamatch} />
          <Image
            style={styles.matchAvatar}
            source={{
              uri: matchDev.avatar,
            }}
          />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}> {matchDev.bio} </Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>BANG IT!</Text>
          </TouchableOpacity>
        </View>
      )
    }

    </SafeAreaView>
 );
};

const styles = StyleSheet.create({
  logo: {
    marginLeft: 90,
  },
  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderBottomWidth: 5,
    borderColor: '#FFF',
    marginVertical: 30,
  },
  matchName:{
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
    zIndex: 1,
  },
  cards: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    zIndex: 1,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2, // só par android ios precisa de cada valor do shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
  },
  empty: {
    color: '#999',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 25,
    justifyContent: 'flex-start',
  },
  profilePic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  closeMatch: {
    width: 100,
    height: 30,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingTop: 7,
  },
});