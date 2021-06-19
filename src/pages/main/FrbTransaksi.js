import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView, Button, Image} from 'react-native';
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
import imgKosong from '../../assets/empty1.jpg';
import {lebar} from '../../fungsi/Dimensi';

const FrbTransaksi = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [tbData, setTbData] = useState({});
  const [tbDataProses, setTbDataProses] = useState([]);
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

    // arrProses.sort((a, b) => (a.txDate < b.txDate ? 1 : -1));

    setTbDataProses(arrProses);
    setTbDataSelesai(arrSelesai);
    setTbDataBatal(arrBatal);
  }, [tbData]);

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

  const buttons = ['Proses', 'Selesai', 'Batal'];
  return (
    <>
      <Headerku judul="Data Transaksi" />
      <ButtonGroup
        onPress={i => setBtnIndex(i)}
        selectedIndex={btnIndex}
        buttons={buttons}
        containerStyle={{height: 40}}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {btnIndex === 0 && tbDataProses.length > 0
          ? tbDataProses.map((v, i) => (
              <Tampilkan key={v.id} nilai={v} ix={i} />
            ))
          : btnIndex === 0 && <NoData />}
        {btnIndex === 1 &&
          tbDataSelesai.map((v, i) => (
            <Tampilkan key={v.id} nilai={v} ix={i} />
          ))}
        {btnIndex === 2 &&
          tbDataBatal.map((v, i) => <Tampilkan key={v.id} nilai={v} ix={i} />)}
      </ScrollView>
    </>
  );
};

const CardProses = ({v, i, onDetail}) => {
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
              {moment(v.txDate).format('DD/MM/YY')}
            </Text>
          </View>
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
                    <Text style={styles.label}>Rp {ribuan(hargaQty)}</Text>
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
            <Text>Rp.{ribuan(totalHarga)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Ongkir :</Text>
            <Text>Rp.{ribuan(v.ongkir)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Bayar :</Text>
            <Text style={{color: Konstanta.warna.satu, fontWeight: 'bold'}}>
              Rp.{ribuan(v.ongkir + totalHarga)}
            </Text>
          </View>
          {v.status === 'proses' && (
            <Text style={{color: 'orangered'}}>
              Sedang dalam proses pengemasan
            </Text>
          )}
          {v.status === 'kirim' && (
            <Text style={{color: 'green'}}>Sedang dalam pengiriman</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onDetail}
          style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="chevron-right" size={20} color={Konstanta.warna.satu} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NoData = () => (
  <View style={styles.tengah}>
    <Image
      source={imgKosong}
      style={{width: lebar * 0.7, height: lebar * 0.7, resizeMode: 'contain'}}
    />
    <Text style={{color: 'orangered', marginBottom: 10}}>
      Tidak ada transaksi
    </Text>
  </View>
);

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
  tengah: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
