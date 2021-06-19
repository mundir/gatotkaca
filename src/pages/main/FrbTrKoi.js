import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView, Image, Button} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import Headerku from '../../komponen/Headerku';
import database from '@react-native-firebase/database';
import moment from 'moment';
import {ribuan} from '../../fungsi/Fungsi';
import Tombol from '../../komponen/Tombol';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Konstanta from '../../fungsi/Konstanta';
import {TouchableOpacity} from 'react-native';
import {AuthContext} from './AuthProvider';
import CartEmpty from '../../assets/cartEmpty.jpg';
import {lebar} from '../../fungsi/Dimensi';

const FrbTrKoi = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [tbData, setTbData] = useState({});
  const [tbDataProses, setTbDataProses] = useState([]);
  const [tbDataSelesai, setTbDataSelesai] = useState([]);
  const [tbDataBatal, setTbDataBatal] = useState([]);
  const [btnIndex, setBtnIndex] = useState(0);

  useEffect(() => {
    const tbRef = database().ref('/transaksiKoi');
    const getData = tbRef
      .orderByChild('userID')
      .equalTo(user.uid)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          setTbData(snapshot.val());
        }
      });
    return () => {
      tbRef.off('value', getData);
    };
  }, []);

  useEffect(() => {
    let arrProses = [];
    let arrSelesai = [];
    let arrBatal = [];
    Object.keys(tbData).forEach(v => {
      const obj = tbData[v];
      if (obj.status === 'proses' || obj.status === 'kirim') {
        arrProses.push({...obj, id: v});
      }
      if (obj.status === 'selesai') {
        arrSelesai.push({...obj, id: v});
      }
      if (obj.status === 'batal') {
        arrBatal.push({...obj, id: v});
      }
    });
    // arrProses.sort(compare);
    setTbDataProses(arrProses);
    setTbDataSelesai(arrSelesai);
    setTbDataBatal(arrBatal);
  }, [tbData]);

  function compare(a, b) {
    if (a.txDate < b.txDate) {
      return -1;
    }
    if (a.txDate > b.txDate) {
      return 1;
    }
    return 0;
  }

  function updateBtnIndex(i) {
    setBtnIndex(i);
    let tCari = buttons[i].toLowerCase();
    console.log(tCari);
  }

  const Tampilkan = ({nilai, ix}) => (
    <CardProses
      key={ix}
      v={nilai}
      i={ix}
      onDetail={() =>
        nilai.status !== 'batal'
          ? navigation.navigate('TransaksiDetail', {
              produkID: nilai.produkID,
              txID: nilai.id,
            })
          : Alert.alert('INFO', 'BATAL')
      }
    />
  );

  const buttons = ['Proses', 'Selesai', 'Batal'];
  return (
    <>
      <Headerku judul="Data Transaksi Koi" />
      <ButtonGroup
        onPress={i => updateBtnIndex(i)}
        selectedIndex={btnIndex}
        buttons={buttons}
        containerStyle={{height: 40}}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.container}> */}
        {btnIndex === 0 && tbDataProses.length > 0
          ? tbDataProses.map((v, i) => (
              <Tampilkan key={v.id} nilai={v} ix={i} />
            ))
          : btnIndex === 0 && (
              <NoData
                onPress={() =>
                  navigation.navigate('ProdukSatuan', {
                    kategori: 'KOI',
                    namaKategori: 'KOI',
                  })
                }
              />
            )}
        {btnIndex === 1 && tbDataSelesai.length > 0
          ? tbDataSelesai.map((v, i) => (
              <Tampilkan key={v.id} nilai={v} ix={i} />
            ))
          : btnIndex === 1 && <NoData />}
        {btnIndex === 2 &&
          tbDataBatal.map((v, i) => <Tampilkan key={v.id} nilai={v} ix={i} />)}
        {/* </View> */}
      </ScrollView>
    </>
  );
};
export default FrbTrKoi;

const CardProses = ({v, i, onDetail}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onDetail}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <View style={styles.row}>
              <Text style={styles.label}>{v.id}</Text>
              <Text style={styles.label}>
                {moment(v.txDate).format('DD/MM/YY')}
              </Text>
            </View>
            <Text style={styles.label}>{v.produkID}</Text>
            <Text style={styles.label}>{v.produkNama}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Harga {ribuan(v.harga)}</Text>
              <Text style={styles.label}>Ongkir {ribuan(v.ongkir)}</Text>
            </View>
            <Text style={styles.label}>
              Bayar Rp{ribuan(v.ongkir + v.harga)}
            </Text>
            {v.status === 'proses' && (
              <Text style={{color: 'orangered'}}>
                Sedang dalam proses pengemasan
              </Text>
            )}
            {v.status === 'kirim' && (
              <Text style={{color: 'green'}}>Sedang dalam pengiriman</Text>
            )}
          </View>

          <View
            style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="chevron-right" size={20} color={Konstanta.warna.satu} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NoData = ({onPress}) => (
  <View style={styles.tengah}>
    <Image
      source={CartEmpty}
      style={{width: lebar * 0.7, height: lebar * 0.7, resizeMode: 'contain'}}
    />
    <Text style={{color: 'orangered', marginBottom: 10}}>
      Ups.. data transaksi kosong
    </Text>
    <View style={{width: lebar / 2}}>
      <Button title="Belanja Sekarang" color="orangered" onPress={onPress} />
    </View>
  </View>
);

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
  tengah: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
