import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Konst from '../../fungsi/Konstanta';
import KoiTabel from './KoiTabel';
import Home from './AdminHome';
import LelangTabel from './LelangTabel';
import ProdukTabel from './ProdukTabel';
const Stack = createStackNavigator();

const StackAdmin = () => {
  return (
    <Stack.Navigator initialRouteName="AdminHome">
      <Stack.Screen
        name="AdminHome"
        component={Home}
        options={{title: 'ADMIN'}}
      />
      <Stack.Screen
        name="KoiTabel"
        component={KoiTabel}
        options={{title: 'Data Koi'}}
      />
      <Stack.Screen
        name="LelangTabel"
        component={LelangTabel}
        options={{title: 'Data Lelang'}}
      />
      <Stack.Screen
        name="ProdukTabel"
        component={ProdukTabel}
        options={{title: 'Data Produk'}}
      />
    </Stack.Navigator>
  );
};

export default StackAdmin;
