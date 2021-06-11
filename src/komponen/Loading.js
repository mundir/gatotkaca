import React from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  View,
} from 'react-native';
import Konstanta from '../fungsi/Konstanta';

const lebar = Dimensions.get('window').width;
const tinggi = Dimensions.get('window').height;

const Loading = ({keterangan}) => {
  return (
    <View style={styles.isLoading}>
      <Text>{keterangan}</Text>
      <ActivityIndicator color={Konstanta.warna.satu} size="large" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  isLoading: {
    position: 'absolute',
    width: lebar,
    height: tinggi,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
