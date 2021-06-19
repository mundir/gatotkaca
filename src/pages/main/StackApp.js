import React from 'react';
import {View, Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Konst from '../../fungsi/Konstanta';

import FrbAkun from './FrbAkun';
import FrbLelang from './FrbLelang';
import FrbTrKoi from './FrbTrKoi';
import FrbTransaksi from './FrbTransaksi';
import ProdukSatuan from './ProdukSatuan';
import FrbTransaksiDetail from './FrbTransakiDetail';
import LelangDetail from './LelangDetail';
import LelangDetailAkan from './LelangDetailAkan';
import ProdukSatuanDetail from './ProdukSatuanDetail';
import TransaksiDetail from './FrbTrDetailKoi';

import Produk from './Produk';
import ProdukDetail from './ProdukDetail';
import Keranjang from './Keranjang';
import BuatPesanan from './BuatPesanan';
import Ongkir from './Ongkir';
import Kosong from './Kosong';

import Setting from '../admin/Setting';
import LelangTabel from '../admin/LelangTabel';
import LelangAdd from '../admin/LelangAdd';
import LelangEdit from '../admin/LelangEdit';
import KoiTabel from '../admin/KoiTabel';
import KoiEdit from '../admin/KoiEdit';
import KoiAdd from '../admin/KoiAdd';
import ProdukAdd from '../admin/ProdukAdd';
import ProdukTabel from '../admin/ProdukTabel';
import ProdukEdit from '../admin/ProdukEdit';
import AdminOngkir from '../admin/AdminOngkir';
import JenisKoi from '../admin/JenisKoi';
import TransaksiTabel from '../admin/TransaksiTabel';
import AdminHome from '../admin/AdminHome';
import Pengguna from '../admin/Pengguna';
import TransaksiKoiTabel from '../admin/TransaksiKoiTabel';
import Mybid from './Mybid';
import Pembayaran from './Pembayaran';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const StackApp = () => {
  return (
    <Stack.Navigator initialRouteName="MyTab">
      <Stack.Screen
        name="MyTab"
        component={MyTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LelangDetail"
        component={LelangDetail}
        options={{title: 'LELANG'}}
      />
      <Stack.Screen
        name="LelangDetailAkan"
        component={LelangDetailAkan}
        options={{title: 'LELANG BERIKUTNYA'}}
      />
      <Stack.Screen
        name="Mybid"
        component={Mybid}
        options={{title: 'LELANG SAYA'}}
      />
      <Stack.Screen
        name="ProdukSatuan"
        component={ProdukSatuan}
        options={{title: 'KOI jual'}}
      />
      <Stack.Screen
        name="ProdukSatuanDetail"
        component={ProdukSatuanDetail}
        options={{
          title: 'KOI DETAIL',
        }}
      />
      <Stack.Screen
        name="Produk"
        component={Produk}
        options={({route}) => ({
          title: route.params.namaKategori,
        })}
      />
      <Stack.Screen
        name="ProdukDetail"
        component={ProdukDetail}
        options={{title: 'Detail Produk'}}
      />
      <Stack.Screen name="Keranjang" component={Keranjang} />
      <Stack.Screen
        name="BuatPesanan"
        component={BuatPesanan}
        options={{title: 'Buat Pesanan'}}
      />
      <Stack.Screen
        name="FrbTransaksiDetail"
        component={FrbTransaksiDetail}
        options={{title: 'Transaksi Detail'}}
      />
      <Stack.Screen
        name="TransaksiDetail"
        component={TransaksiDetail}
        options={{title: 'Transaksi Detail'}}
      />
      <Stack.Screen
        name="Ongkir"
        component={Ongkir}
        options={{title: 'Ongkos Kirim'}}
      />
      <Stack.Screen
        name="Pembayaran"
        component={Pembayaran}
        options={{title: 'Informasi Pembayaran'}}
      />

      {/* ========================================== */}
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{title: 'ADMIN'}}
      />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen
        name="LelangTabel"
        component={LelangTabel}
        options={{title: 'Data Lelang'}}
      />
      <Stack.Screen
        name="LelangEdit"
        component={LelangEdit}
        options={{title: 'Lelang Edit'}}
      />
      <Stack.Screen
        name="LelangAdd"
        component={LelangAdd}
        options={{title: 'Lelang Tambah'}}
      />
      <Stack.Screen
        name="KoiTabel"
        component={KoiTabel}
        options={{title: 'Data Koi'}}
      />
      <Stack.Screen
        name="KoiEdit"
        component={KoiEdit}
        options={{title: 'Produk Edit'}}
      />
      <Stack.Screen
        name="KoiAdd"
        component={KoiAdd}
        options={{title: 'Produk Tambah'}}
      />
      <Stack.Screen
        name="ProdukTabel"
        component={ProdukTabel}
        options={{title: 'Data Barang'}}
      />
      <Stack.Screen
        name="ProdukEdit"
        component={ProdukEdit}
        options={{title: 'Produk Edit'}}
      />
      <Stack.Screen
        name="ProdukAdd"
        component={ProdukAdd}
        options={{title: 'Produk Tambah'}}
      />
      <Stack.Screen
        name="AdminOngkir"
        component={AdminOngkir}
        options={{title: 'ONGKIR'}}
      />
      <Stack.Screen
        name="JenisKoi"
        component={JenisKoi}
        options={{title: 'Jenis KOI'}}
      />
      <Stack.Screen
        name="TransaksiTabel"
        component={TransaksiTabel}
        options={{title: 'Tabel Transaksi'}}
      />
      <Stack.Screen
        name="TransaksiKoiTabel"
        component={TransaksiKoiTabel}
        options={{title: 'Tabel Transaksi Koi'}}
      />
      <Stack.Screen
        name="Users"
        component={Pengguna}
        options={{title: 'Data Pengguna'}}
      />
    </Stack.Navigator>
  );
};

export default StackApp;

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      tabBarOptions={{
        activeTintColor: Konst.warna.satu,
      }}>
      <Tab.Screen
        name="Home"
        component={Kosong}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Lelang"
        component={FrbLelang}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="bitcoin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FrbTrKoi"
        component={FrbTrKoi}
        options={{
          title: 'Beli Koi',
          tabBarIcon: ({color, size}) => (
            <Icon name="paw" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transaksi"
        component={FrbTransaksi}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-bag" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Akun"
        component={FrbAkun}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
