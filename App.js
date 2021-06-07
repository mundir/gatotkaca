import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Akun from './src/pages/Akun';
import Home from './src/pages/Home';
import Detail from './src/pages/Detail';
import Transaksi from './src/pages/Transaksi';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {
  function HomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="firstRoute"
        tabBarOptions={{
          activeTintColor: '#e91e63',
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Transaksi"
          component={Transaksi}
          options={{
            tabBarLabel: 'Transaksi',
            tabBarIcon: ({color, size}) => (
              <Icon name="inventory" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Akun"
          component={Akun}
          options={{
            tabBarLabel: 'Akun',
            tabBarIcon: ({color, size}) => (
              <Icon name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
