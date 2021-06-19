import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';

const AdminHome = ({navigation}) => {
  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={styles.btn}>
        <Button
          title="Data Koi"
          onPress={() => navigation.navigate('KoiTabel')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Data Lelang"
          onPress={() => navigation.navigate('LelangTabel')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Data Produk"
          onPress={() => navigation.navigate('ProdukTabel')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Data Pengguna"
          onPress={() => navigation.navigate('Users')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Data Transaksi"
          onPress={() => navigation.navigate('TransaksiTabel')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Data Transaksi Koi"
          onPress={() => navigation.navigate('TransaksiKoiTabel')}
        />
      </View>
      <View
        style={{
          height: 10,
          borderBottomColor: 'gray',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 10,
        }}
      />
      <View style={styles.btn}>
        <Button
          title="Setting"
          color="orangered"
          onPress={() => navigation.navigate('Setting')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Jenis Koi"
          color="orangered"
          onPress={() => navigation.navigate('JenisKoi')}
        />
      </View>
      <View style={styles.btn}>
        <Button
          title="Ongkir Clarista"
          color="orangered"
          onPress={() => navigation.navigate('AdminOngkir')}
        />
      </View>
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  btn: {paddingVertical: 5, paddingHorizontal: 20},
});
