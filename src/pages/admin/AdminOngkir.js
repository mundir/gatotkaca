/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card, SearchBar, Input} from 'react-native-elements';
import database from '@react-native-firebase/database';
import {generateid, ribuan} from '../../fungsi/Fungsi';
const AdminOngkir = ({navigation}) => {
  const [tbData, setTbData] = useState([]);
  const [tbTampil, setTbTampil] = useState([]);
  const [cari, setCari] = useState('');
  const [tampilModal, setTampilModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [indexTerpilih, setIndexTerpilih] = useState(null);
  const [mode, setMode] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <Button onPress={nambah} title="Tambah" color="orangered" />
        </View>
      ),
    });
  }, [navigation]);

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

  // function getUrl() {
  //   fetch('http://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=32')
  //     .then(response => response.json())
  //     .then(json => console.log(json))
  //     .catch(error => console.error(error))
  //     .finally(() => {});
  // }

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

  function edit(dt, i) {
    setMode('edit');
    setRowData(dt);
    setTampilModal(true);
    setIndexTerpilih(i);
    console.log(i);
  }

  function simpan() {
    if (rowData.kota === '' || rowData.harga === '') {
      Alert.alert('Perhatian', 'Data tidak boleh kosong!');
      return;
    }
    if (mode === 'edit') {
      let tmp = [...tbTampil];
      tmp[indexTerpilih] = rowData;
      setTbTampil(tmp);
      let idx = tbData.findIndex(x => x.id === rowData.id);
      tmp = [...tbData];
      tmp[idx] = rowData;
      setTbData(tmp);
      database()
        .ref('/ongkirKoi/' + rowData.id)
        .update(rowData)
        .then(() => {
          console.log('oke');
        });
      setTampilModal(false);
      return;
    }
    if (mode === 'tambah') {
      let res = rowData.kota.substring(0, 4);
      let gId = generateid(res, 4);
      database()
        .ref('/ongkirKoi/' + gId)
        .set(rowData)
        .then(() => {
          console.log('oke');
        });
      let tmp = [...tbTampil];
      tmp.push(rowData);
      setTbTampil(tmp);
      tmp = [...tbData];
      tmp.push(rowData);
      setTbData(tmp);
      setTampilModal(false);
    }
  }

  function nambah() {
    setMode('tambah');
    setRowData({});
    setTampilModal(true);
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
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
              <TouchableOpacity
                key={i}
                onPress={() => edit(v, i)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 7,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.7,
                }}>
                <Text style={styles.name}>{v.kota}</Text>
                <Text style={styles.name}>{ribuan(v.harga)}</Text>
              </TouchableOpacity>
            );
          })}
        </Card>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={tampilModal}
        onRequestClose={() => {
          setTampilModal(false);
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <TouchableOpacity
            style={{flex: 1, width: '100%'}}
            onPress={() => setTampilModal(false)}
          />
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'white',
              padding: 20,
            }}>
            <Input
              label="KOTA"
              value={rowData.kota}
              onChangeText={t => setRowData(prev => ({...prev, kota: t}))}
            />
            <Input
              label="ONGKIR"
              value={'harga' in rowData ? rowData.harga.toString() : 0}
              keyboardType="numeric"
              onChangeText={t =>
                setRowData(prev => ({...prev, harga: Number(t)}))
              }
            />
            <Button title="Simpan" onPress={() => simpan('edit')} />
          </View>
          <TouchableOpacity
            style={{flex: 1, width: '100%'}}
            onPress={() => setTampilModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default AdminOngkir;

const styles = StyleSheet.create({});
