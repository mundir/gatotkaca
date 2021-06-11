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
const JenisKoi = ({navigation}) => {
  const [tbData, setTbData] = useState([]);
  const [tbTampil, setTbTampil] = useState([]);
  const [cari, setCari] = useState('');
  const [tampilModal, setTampilModal] = useState(false);
  const [rowData, setRowData] = useState('');
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
      .ref('/setting/filterJenis')
      .once('value')
      .then(snapshot => {
        if (isMount) {
          setTbData(snapshot.val());
          setTbTampil(snapshot.val());
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
      let jenis = v ? v.toLowerCase() : '';
      return jenis.includes(t.toLowerCase());
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
    if (rowData === '') {
      Alert.alert('Perhatian', 'Data tidak boleh kosong!');
      return;
    }
    if (mode === 'edit') {
      let tmp = [...tbTampil];
      tmp[indexTerpilih] = rowData;
      setTbTampil(tmp);
      let idx = tbData.findIndex(x => x === rowData);
      tmp = [...tbData];
      tmp[idx] = rowData;
      setTbData(tmp);
      database()
        .ref('/setting/filterJenis')
        .set(tbData)
        .then(() => {
          console.log('oke');
        });
      setTampilModal(false);
      return;
    }
    if (mode === 'tambah') {
      let tmp = [...tbData];
      tmp.push(rowData);
      setTbData(tmp);
      database()
        .ref('/setting/filterJenis')
        .set(tmp)
        .then(() => {
          console.log('oke');
        });
      tmp = [...tbTampil];
      tmp.push(rowData);
      setTbTampil(tmp);
      setTampilModal(false);
    }
  }

  function nambah() {
    setMode('tambah');
    setRowData('');
    setTampilModal(true);
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <SearchBar
          placeholder="cari jenis"
          value={cari}
          onChangeText={text => mencari(text)}
          platform="android"
          onClear={resetCari}
        />
        <Card>
          {tbTampil.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => edit(v, i)}
                style={{
                  paddingVertical: 7,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.7,
                }}>
                <Text style={styles.name}>{v}</Text>
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
              label="JENIS"
              value={rowData}
              onChangeText={t => setRowData(t)}
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

export default JenisKoi;

const styles = StyleSheet.create({});
