/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import {Card, SearchBar} from 'react-native-elements';
import database from '@react-native-firebase/database';
import { ribuan } from '../../fungsi/Fungsi';
const Ongkir = () => {
  const [tbData, setTbData] = useState([]);
  const [tbTampil, setTbTampil] = useState([]);
  const [cari, setCari] = useState('');

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    return () => (isMount = true);
  }, []);

  function getDt(isMount) {
    database()
      .ref('/ongkirKoi')
      .once('value')
      .then(snapshot => {
        if (isMount) {
          let arr = [];
          snapshot.forEach(v => {
            arr.push({...v.val()});
          });
          setTbData(arr);
          setTbTampil(arr);
        }
      });
  }

  function mencari(t) {
    const tmp = [...tbData];
    const hasilFilter = tmp.filter(v => {
      let kota = v.kota ? v.kota.toLowerCase() : '';
      return kota.includes(t.toLowerCase());
    });
    setCari(t);
    setTbTampil(hasilFilter);
  }

  function resetCari() {
    setCari('');
    setTbTampil(tbData);
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <SearchBar
          placeholder="cari kota"
          value={cari}
          onChangeText={text => mencari(text)}
          platform="android"
          onClear={resetCari}
        />
        <Card>
          <Card.Title>ESTIMASI ONGKOS KIRIM</Card.Title>
          <Card.Divider />
          {tbTampil.map((v, i) => {
            return (
              <View
                key={i}
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.name}>{v.kota}</Text>
                <Text style={styles.name}>{ribuan(v.harga)}</Text>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
};

export default Ongkir;

const styles = StyleSheet.create({});
