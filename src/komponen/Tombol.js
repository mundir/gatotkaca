import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tombol = ({text, warna, icon, onPress}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.btn, {backgroundColor: warna}]}>
        <Icon name={icon} size={18} color="white" />
        <Text style={styles.tBtn}>
          {'  '}
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tombol;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  tBtn: {color: 'white', fontWeight: 'bold', textTransform: 'uppercase'},
});
