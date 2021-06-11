import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './AuthLogin';
import AuthDaftar from './AuthDaftar';

const Stack = createStackNavigator();

const StackAuth = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AuthDaftar"
        component={AuthDaftar}
        options={{title: 'Registrasi'}}
      />
    </Stack.Navigator>
  );
};

export default StackAuth;
