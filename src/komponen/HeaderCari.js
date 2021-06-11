import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Pressable,
} from 'react-native';
import Konstanta from './Konstanta';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderCari = ({cari, keranjang}) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={cari} style={styles.cari}>
        <Text style={{color: 'gray'}}>Cari Produk ...</Text>
        <Icon name="search" color={Konstanta.warna.satu} size={20} />
      </Pressable>
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity style={{width: 40}} onPress={keranjang}>
          <Icon name="shopping-cart" color="white" size={26} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderCari;

const styles = StyleSheet.create({
  header: {
    backgroundColor: Konstanta.warna.satu,
    height: 50,
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cari: {
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 15,
    backgroundColor: 'white',
    width: '80%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
