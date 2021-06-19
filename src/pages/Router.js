import React, {useState, useEffect, useContext} from 'react';
import {View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AuthContext} from './main/AuthProvider';
import Kosong from './main/Kosong';
import StackAuth from './auth/StackAuth';
import StackApp from './main/StackApp';


const Router = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '707469029747-ir43e8t3qooljt4sffsfpg9mdurnkh2t.apps.googleusercontent.com',
    });
    const subcriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subcriber;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Info dari Admin', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  const onAuthStateChanged = userFromAuth => {
    if (userFromAuth) {
      // cek apakah sudah tersimpan di database
      const tbRef = database().ref('/users/' + userFromAuth.uid);
      tbRef
        .once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
            setUser(snapshot.val()); //null or auth.userProfile
          } else {
            const {
              displayName,
              email,
              emailVerified,
              phoneNumber,
              photoURL,
              providerId,
              uid,
            } = userFromAuth;
            const inDt = {
              displayName,
              email,
              emailVerified,
              phoneNumber,
              photoURL,
              providerId,
              uid,
              isAdmin: false,
              alamat: '',
            };
            tbRef.set(inDt).then(() => setUser(inDt));
          }
        })
        .catch(e => console.log(e));
    } else {
      setUser(null);
    }
    if (initializing) {
      setInitializing(false);
    }
  };

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <StackApp /> : <StackAuth />}
    </NavigationContainer>
  );
};

export default Router;
