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
import {ButtonGroup, Overlay} from 'react-native-elements';
import moment from 'moment';
import {ribuan} from '../../fungsi/Fungsi';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';

const buttons = ['Proses', 'kirim', 'Selesai', 'Batal'];

const TransaksiTabel = () => {
  const [tbData, setTbData] = useState([]);
  const [tbDataProses, setTbDataProses] = useState([]);
  const [tbDataKirim, setTbDataKirim] = useState([]);
  const [tbDataSelesai, setTbDataSelesai] = useState([]);
  const [tbDataBatal, setTbDataBatal] = useState([]);
  const [btnIndex, setBtnIndex] = useState(0);
  const [tampilEdit, setTampilEdit] = useState(false);
  const [selectedID, setSelectedID] = useState('');
  const [selectedListProduk, setSelectedListProduk] = useState([]);
  const [dataUser, setDataUser] = useState({});

  useEffect(() => {
    const tbRef = database().ref('transaksi');
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
    let produk = Object.values(x.produk);
    console.log(produk);
    setSelectedListProduk(produk);
    let userID = x.userID;
    getDtUser(userID);
    setSelectedID(x.id);
    setTampilEdit(true);
  }

  function updateStatus(status) {
    const tbRef = database().ref('transaksi/' + selectedID);
    tbRef.update({status: status}).then(() => {
      if (status === 'kirim') {
        updateStok();
      } else {
        setTampilEdit(false);
        console.log('oke');
      }
    });
  }

  function updateStok() {
    selectedListProduk.forEach(v => {
      const dbRef = database().ref('produk/' + v.produkID);
      dbRef.once('value').then(snapshot => {
        let stok = snapshot.val().stok;
        let terjual = snapshot.val().terjual;
        terjual = terjual + v.qty;
        if (stok >= v.qty) {
          stok = stok - v.qty;
        } else {
          stok = 0;
        }
        dbRef
          .update({stok: stok, terjual: terjual})
          .then(() => console.log('stok updated'));
      });
    });
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
        </View>
      </Overlay>
    </View>
  );
};

export default TransaksiTabel;

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
          <Text>
            {v.kurirData.code} - {v.kurirData.description}
          </Text>
          {Object.keys(v.produk).map(vkey => {
            const produks = v.produk;
            const produkITem = produks[vkey];
            const hargaQty = produkITem.harga * produkITem.qty;
            hitung = hitung + 1;
            totalHarga = totalHarga + hargaQty;
            return (
              <View key={vkey} style={{flexDirection: 'row'}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                  }}>
                  <Text>{hitung}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {produkITem.produkNama}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      @ {ribuan(produkITem.harga)}
                    </Text>
                    <Text style={styles.label}>x {produkITem.qty}</Text>
                    <Text style={styles.label}>{ribuan(hargaQty)}</Text>
                  </View>
                </View>
              </View>
            );
          })}
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              height: 5,
            }}
          />
          <View style={styles.row}>
            <Text>Total Harga :</Text>
            <Text>{ribuan(totalHarga)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Ongkir :{v.ongkir}</Text>
            <Text>{ribuan(v.ongkir)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Bayar :</Text>
            <Text style={{color: Konstanta.warna.satu, fontWeight: 'bold'}}>
              Rp.{ribuan(v.ongkir + totalHarga)}
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
