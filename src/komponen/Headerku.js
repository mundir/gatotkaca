import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Konstanta from './Konstanta';
import Icon from 'react-native-vector-icons/FontAwesome';
const Headerku = ({
  judul,
  icon,
  badgeValue,
  tKanan,
  komponenKiri,
  onPressKanan,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.kiri}>{komponenKiri}</View>
      <View style={styles.tengah}>
        <Text style={styles.tJudul}>{judul}</Text>
      </View>
      <View style={styles.kanan}>
        <TouchableOpacity onPress={onPressKanan}>
          {icon && <Icon name={icon} color="white" size={18} />}
          {badgeValue > 0 && (
            <View style={[styles.badge, {backgroundColor: 'green'}]}>
              <Text style={styles.tBadge}>{badgeValue}</Text>
            </View>
          )}
          {tKanan && (
            <Text style={{fontWeight: 'bold', color: 'white'}}>{tKanan}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Headerku;

const styles = StyleSheet.create({
  container: {
    height: 42,
    backgroundColor: Konstanta.warna.satu,
    flexDirection: 'row',
  },
  kiri: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  tengah: {flex: 4, alignItems: 'center', justifyContent: 'center'},
  kanan: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tJudul: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    textTransform: 'uppercase',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    left: 18,
  },
  tBadge: {fontSize: 10, color: 'white'},
});
