import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
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

const FrbTransaksi = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [tbData, setTbData] = useState({});
  const [tbDataProses, setTbDataProses] = useState([]);
  const [tbDataKirim, setTbDataKirim] = useState([]);
  const [tbDataSelesai, setTbDataSelesai] = useState([]);
  const [tbDataBatal, setTbDataBatal] = useState([]);
  const [btnIndex, setBtnIndex] = useState(0);

  useEffect(() => {
    const tbRef = database().ref('transaksi');
    const getData = tbRef
      .orderByChild('userID')
      .equalTo(user.uid)
      .on('value', snapshot => {
        if (snapshot.exists()) setTbData(snapshot.val());
      });
    return () => {
      tbRef.off('value', getData);
    };
  }, []);

  useEffect(() => {
    let arrProses = [];
    let arrKirim = [];
    let arrSelesai = [];
    let arrBatal = [];
    Object.keys(tbData).forEach(v => {
      const obj = tbData[v];
      switch (obj.status) {
        case 'proses':
          arrProses.push({...obj, id: v});
          break;
        case 'kirim':
          arrKirim.push({...obj, id: v});
          break;
        case 'selesai':
          arrSelesai.push({...obj, id: v});
          break;
        case 'batal':
          arrBatal.push({...obj, id: v});
          break;
        default:
          break;
      }
    });

    // arrProses.sort((a, b) => (a.txDate < b.txDate ? 1 : -1));

    setTbDataProses(arrProses);
    setTbDataKirim(arrKirim);
    setTbDataSelesai(arrSelesai);
    setTbDataBatal(arrBatal);
  }, [tbData]);

  function batalkan(id) {
    Alert.alert('PERHATIAN', 'Apakah yakin akan membatalkan transaksi ini?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          const tbRef = database().ref('/produkSatuan/' + id);
          tbRef
            .update({status: 'ready', proses: 'batal'})
            .then(() => setBtnIndex(3));
        },
      },
    ]);
  }

  function terima(id) {
    const tbRef = database().ref('/produkSatuan/' + id);
    tbRef.update({proses: 'selesai'}).then(() => setBtnIndex(2));
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
        navigation.navigate('FrbTransaksiDetail', {
          txID: nilai.id,
        })
      }
    />
  );

  const buttons = ['Proses', 'Kirim', 'Selesai', 'Batal'];
  return (
    <ScrollView>
      <Headerku judul="Data Transaksi" />
      <ButtonGroup
        onPress={i => updateBtnIndex(i)}
        selectedIndex={btnIndex}
        buttons={buttons}
        containerStyle={{height: 40}}
      />
      <View style={styles.container}>
        {btnIndex === 0 &&
          tbDataProses.map((v, i) => <Tampilkan key={v.id} nilai={v} ix={i} />)}
        {btnIndex === 1 &&
          tbDataKirim.map((v, i) => <Tampilkan key={v.id} nilai={v} ix={i} />)}
        {btnIndex === 2 &&
          tbDataSelesai.map((v, i) => (
            <Tampilkan key={v.id} nilai={v} ix={i} />
          ))}
        {btnIndex === 3 &&
          tbDataBatal.map((v, i) => <Tampilkan key={v.id} nilai={v} ix={i} />)}
      </View>
    </ScrollView>
  );
};

const CardProses = ({v, i, onDetail}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onDetail}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <View style={styles.row}>
              <Text style={styles.label}>ID: {v.id}</Text>
              <Text style={styles.label}>
                {moment(v.txDate).format('DD/MM/YY')}
              </Text>
            </View>
            {Object.keys(v.produk).map(vkey => {
              const produks = v.produk;
              const produkITem = produks[vkey];
              return (
                <View key={vkey} style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 30,
                    }}>
                    <Text>1</Text>
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
                      <Text style={styles.label}>
                        Rp {ribuan(produkITem.harga * produkITem.qty)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
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

const Card = ({v, i, onBatal}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{v.id}</Text>
        <Text style={styles.label}>{v.nama}</Text>
        <Text style={styles.label}>{ribuan(v.harga)}</Text>
        <Text style={styles.label}>{moment(v.txDate).format('DD/MM/YY')}</Text>
      </View>
    </View>
  );
};

export default FrbTransaksi;

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
