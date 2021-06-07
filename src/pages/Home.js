import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CardProduk from '../komponen/ListProduk';
import Tombol from '../komponen/Tombol';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Ini adalah tab Home</Text>
      <Tombol
        icon="home"
        warna="green"
        text="ke halaman"
        onPress={() => navigation.navigate('Detail')}
      />
      <CardProduk />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
