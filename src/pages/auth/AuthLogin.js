import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {AuthContext} from '../main/AuthProvider';

import FormInput from '../../komponen/FormInput';
import FormButton from '../../komponen/FormButton';
import SocialButton from '../../komponen/SocialButton';
import Loading from '../../komponen/Loading';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {authLoading, emailLogin, googleLogin, fbLogin} =
    useContext(AuthContext);

  function melogin() {
    if (email === '') {
      Alert.alert('ERROR', 'EMAIL tidak boleh kosong');
      return;
    }
    if (password === '') {
      Alert.alert('ERROR', 'PASSWORD tidak boleh kosong');
      return;
    }
    emailLogin(email, password);
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/jkc.png')} style={styles.logo} />
      <Text style={styles.text}>Jawa Koi Center</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => setEmail(userEmail)}
        placeholderText="Email"
        iconType="envelope"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={userPassword => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton buttonTitle="Sign In" onPress={melogin} />

      {/* <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>lupa Password?</Text>
      </TouchableOpacity> */}
      <View style={{height: 30}} />

      <SocialButton
        buttonTitle="Masuk dengan Facebook"
        btnType="facebook"
        color="#4867aa"
        backgroundColor="#e6eaf4"
        onPress={() => {
          fbLogin();
        }}
      />

      <SocialButton
        buttonTitle="Masuk dengan Google"
        btnType="google"
        color="#de4d41"
        backgroundColor="#f5e7ea"
        onPress={() => {
          googleLogin();
        }}
      />

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('AuthDaftar')}>
        <Text style={styles.navButtonText}>Belum punya Akun? Buat disini</Text>
      </TouchableOpacity>
      {authLoading && <Loading />}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 20,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});
