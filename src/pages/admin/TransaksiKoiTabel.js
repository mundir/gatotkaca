import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import {ButtonGroup, Overlay, Input} from 'react-native-elements';
import moment from 'moment';
import {ribuan} from '../../fungsi/Fungsi';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';

const buttons = ['Proses', 'kirim', 'Selesai', 'Batal'];

const TransaksiKoiTabel = () => {
  const [tbData, setTbData] = useState([]);
  const [tbDataProses, setTbDataProses] = useState([]);
  const [tbDataKirim, setTbDataKirim] = useState([]);
  const [tbDataSelesai, setTbDataSelesai] = useState([]);
  const [tbDataBatal, setTbDataBatal] = useState([]);
  const [btnIndex, setBtnIndex] = useState(0);
  const [tampilEdit, setTampilEdit] = useState(false);
  const [selectedID, setSelectedID] = useState('');
  const [ongkir, setOngkir] = useState(0);
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    const tbRef = database().ref('transaksiKoi');
    const getData = tbRef.on('value', snapshot => {
      let arr = [];
      snapshot.forEach(v => {
        arr.push({...v.val(), id: v.key});
      });
      setTbData(arr);
    });
    return () => {
      tbRef.off('value', getData);
    };
  }, []);

  useEffect(() => {
    let ArrProses = tbData.filter(v => v.status === 'proses');
    let ArrKirim = tbData.filter(v => v.status === 'kirim');
    let ArrSelesai = tbData.filter(v => v.status === 'selesai');
    let ArrBatal = tbData.filter(v => v.status === 'batal');
    setTbDataProses(ArrProses);
    setTbDataKirim(ArrKirim);
    setTbDataSelesai(ArrSelesai);
    setTbDataBatal(ArrBatal);
  }, [tbData]);

  function getDtUser(id) {
    const tbRef = database().ref('users/' + id);
    tbRef.once('value').then(snapshot => {
      snapshot.exists ? setDataUser(snapshot.val()) : null;
    });
  }

  function handleDetail(x) {
    console.log(x.id);
    let userID = x.userID;
    getDtUser(userID);
    setSelectedID(x.id);
    setOngkir(x.ongkir);
    setTampilEdit(true);
  }

  function updateStatus(status) {
    const tbRef = database().ref('transaksiKoi/' + selectedID);
    tbRef.update({status: status}).then(() => console.log('sukses'));
    setTampilEdit(false);
  }

  function updateStatusBatal() {
    Alert.alert('PERHATIAN', 'Apakah yakin akan membatalkan pesanan ini?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => updateStatus('batal')},
    ]);
  }

  function updateOngkir() {
    const tbRef = database().ref('transaksiKoi/' + selectedID);
    tbRef.update({ongkir: ongkir}).then(() => console.log('sukses'));
    setTampilEdit(false);
  }

  const renderItem = ({item}) => (
    <CardProses v={item} onDetail={() => handleDetail(item)} />
  );

  return (
    <View style={{flex: 1}}>
      <ButtonGroup
        onPress={i => setBtnIndex(i)}
        selectedIndex={btnIndex}
        buttons={buttons}
        containerStyle={{height: 40}}
      />
      {btnIndex === 0 && (
        <FlatList
          data={tbDataProses}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {btnIndex === 1 && (
        <FlatList
          data={tbDataKirim}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {btnIndex === 2 && (
        <FlatList
          data={tbDataSelesai}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {btnIndex === 3 && (
        <FlatList
          data={tbDataBatal}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      <Overlay
        isVisible={tampilEdit}
        onBackdropPress={() => setTampilEdit(false)}>
        <View style={{width: 300}}>
          <Text>{dataUser.displayName}</Text>
          <Text>{dataUser.phoneNumber}</Text>
          <Text>Alamat Detail:</Text>
          <Text numberOfLines={3}>{dataUser.alamat}</Text>
          <Text>Kab/Kota {dataUser.kotaNama}</Text>
          <Text>Provinsi {dataUser.provinsi}</Text>
          <View
            style={{
              height: 10,
              marginBottom: 10,
              borderBottomColor: 'gray',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button title="BATALKAN" color="red" onPress={updateStatusBatal} />
            {btnIndex === 0 && (
              <Button
                title="KIRIM"
                color="blue"
                onPress={() => updateStatus('kirim')}
              />
            )}
            {btnIndex === 1 && (
              <Button
                title="SELESAI"
                color="green"
                onPress={() => updateStatus('selesai')}
              />
            )}
          </View>
          <Input
            label="ONGKIR"
            value={'' + ongkir}
            onChangeText={t => setOngkir(Number(t))}
            containerStyle={{marginTop: 10}}
          />
          <Button
            title="Update Ongkir"
            color="lightslategrey"
            onPress={updateOngkir}
          />
        </View>
      </Overlay>
    </View>
  );
};

export default TransaksiKoiTabel;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  card: {
    padding: 10,
    borderWidth: 0.1,
    borderColor: 'gray',
    borderRadius: 3,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
});

const CardProses = ({v, onDetail}) => {
  let hitung = 0;
  let totalHarga = 0;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <View style={styles.row}>
            <Text style={styles.label} selectable>
              {v.id}
            </Text>
            <Text style={styles.label}>
              {moment(v.txDate).format('DD/MM/YY HH:mm')}
            </Text>
          </View>
          <Text>{v.userNama}</Text>
          <View style={styles.row}>
            <Text>Barang ID:</Text>
            <Text>{v.produkID}</Text>
          </View>
          <View style={styles.row}>
            <Text>Nama Barang:</Text>
            <Text>{v.produkNama}</Text>
          </View>

          <View style={styles.row}>
            <Text>Harga:</Text>
            <Text>{ribuan(v.harga)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Ongkir:</Text>
            <Text>{ribuan(v.ongkir)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Bayar :</Text>
            <Text style={{color: Konstanta.warna.satu, fontWeight: 'bold'}}>
              Rp.{ribuan(v.ongkir + v.harga)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onDetail}
          style={{
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="chevron-right" size={20} color={Konstanta.warna.satu} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
