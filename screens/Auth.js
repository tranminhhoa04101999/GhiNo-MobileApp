import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Color from '../constants/Color';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/action/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const image = {
  uri: 'https://firebasestorage.googleapis.com/v0/b/ghino-a0fa1.appspot.com/o/Hinh-nen-Minion-2.jpg?alt=media',
};

const Auth = ({props, navigation}) => {
  const dispatch = useDispatch();
  const [tk, setTk] = useState('');
  const [mk, setMk] = useState('');
  useEffect(() => {
    const getData = async () => {
      let data = await AsyncStorage.getItem('account');
      if (data != null) {
        navigation.replace('tab');
      }
    };
    getData();
  }, [dispatch, navigation]);
  const onPressHandler = async () => {
    try {
      await dispatch(authActions.Login(tk, mk));
      navigation.replace('tab');
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.background}>
        <View style={styles.center}>
          <TextInput
            style={styles.input}
            placeholder="Tài Khoản"
            value={tk}
            onChangeText={text => {
              setTk(text);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật Khẩu"
            value={mk}
            onChangeText={text => setMk(text)}
          />
          <View style={styles.btnWrap}>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => onPressHandler()}>
              <Text style={styles.btnLoginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1},
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    backgroundColor: 'white',
    height: 250,
    width: '70%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 10,
    alignItems: 'center',
  },
  input: {
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    width: '80%',
    fontSize: 16,
    lineHeight: 16,
    padding: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  btnLogin: {
    backgroundColor: Color.xanhMinion,
    width: 100,
    height: 35,
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 5,
    marginTop: 40,
  },
  btnLoginText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Auth;
