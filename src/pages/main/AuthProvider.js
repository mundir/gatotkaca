import React from 'react';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  const emailLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return auth().currentUser;
    } catch (e) {
      Alert.alert('ERROR', e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const emailCreate = async (nama, email, password) => {
    setAuthLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      const inDt = {displayName: nama};
      return auth().currentUser.updateProfile(inDt);
    } catch (e) {
      Alert.alert('ERROR', e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const fbLogin = async () => {
    setAuthLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setAuthLoading(false);
        throw 'User cancelled the login process';
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        setAuthLoading(false);
        Alert.alert('ERROR', 'Something went wrong obtaining access token');
        throw 'Something went wrong obtaining access token';
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      await auth().signInWithCredential(facebookCredential);
      return auth().currentUser;
    } catch (error) {
      Alert.alert('ERROR', error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const googleLogin = async () => {
    setAuthLoading(true);
    try {
      const {idToken} = await GoogleSignin.signIn();
      if (!idToken) {
        Alert.alert('ERROR', 'Something went wrong obtaining access token');
        setAuthLoading(false);
        throw 'Something went wrong obtaining access token';
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      return auth().currentUser;
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  async function logout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .catch(e => {
        Alert.alert('ERROR', e.message);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        setUser,
        emailCreate,
        emailLogin,
        fbLogin,
        googleLogin,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
