import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, Alert, Linking} from 'react-native';
import Header from '../../komponen/Headerku';
import database from '@react-native-firebase/database';
import Headerku from '../../komponen/Headerku';
import Tombol from '../../komponen/Tombol';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import {AuthContext} from './AuthProvider';

const FrbTrDetailKoi = ({navigation, route}) => {
  const produkID = route.params.produkID;
  const {user} = React.useContext(AuthContext);

  const [tbData, setTbData] = useState({});
  const [dtInfo, setDtInfo] = useState('');

  useEffect(() => {
    getDt();
    getInfo();
  }, []);

  function getDt() {
    database()
      .ref('/produkSatuan/' + produkID)
      .once('value')
      .then(snapshot => {
        setTbData(snapshot.val());
      });
  }

  function getInfo() {
    database()
      .ref('/setting/infoTransaksiKoi')
      .once('value')
      .then(snapshot => {
        setDtInfo(snapshot.val());
      });
  }

  const wa = () => {
    const isi = 'Saya konfirmasi untuk transaksi ' + tbData.nama;
    let url = 'whatsapp://send?text=' + isi + '&phone=6289615221998';
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert(
          'Perhatian',
          'tidak dapat terhubung dengan WA, pastikan HP anda sudah terinstall WA!',
        );
      });
  };

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
            .then(() => navigation.navigate('FrbTrKoi'));
        },
      },
    ]);
  }

  return (
    <ScrollView>
      <Headerku judul="info transaksi" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.contJudul}>
            <Text style={styles.judul}>Data Barang</Text>
          </View>
          <View style={styles.row}>
            <Text>Nama Produk :</Text>
            <Text>{tbData.nama}</Text>
          </View>
          <View style={styles.row}>
            <Text>Harga :</Text>
            <Text>{ribuan(tbData.harga)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Ongkir :</Text>
            <Text>{ribuan(tbData.ongkir)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Total Bayar :</Text>
            <Text style={{fontWeight: 'bold', color: Konstanta.warna.satu}}>
              {ribuan(tbData.ongkir + tbData.harga)}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.contJudul}>
            <Text style={styles.judul}>Deskripsi Produk</Text>
          </View>
          <Text>{tbData.deskripsi}</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.contJudul}>
            <Text style={styles.judul}>Info Transaksi</Text>
          </View>
          <Text>{dtInfo}</Text>
        </View>
        <View style={{height: 20}} />
        <View style={styles.card}>
          {tbData.proses === 'proses' && (
            <View style={styles.row}>
              <Tombol
                text="Cek Ongkir"
                warna="#075E54"
                onPress={() => navigation.navigate('Ongkir')}
              />
              <Tombol
                text="Konf WA"
                warna="#25D366"
                onPress={wa}
                marginHorizontal={5}
              />
              {user.isAdmin && (
                <Tombol
                  text="Batalkan"
                  warna="red"
                  onPress={() => batalkan(produkID)}
                />
              )}
            </View>
          )}
          {tbData.proses === 'kirim' && (
            <View style={{alignItems: 'center'}}>
              <Text>Produk sedang dalam proses pengiriman.</Text>
              <Text>Jika produk sudah anda terima, klik tombol TERIMA</Text>
              <Tombol
                text="TERIMA"
                warna={Konstanta.warna.dua}
                onPress={() => navigation.navigate('FrbTrKoi')}
              />
            </View>
          )}
          {tbData.proses === 'selesai' && (
            <View style={{alignItems: 'center'}}>
              <Text>Transaksi Selesai</Text>
            </View>
          )}
          {tbData.proses === 'batal' && (
            <View style={{alignItems: 'center'}}>
              <Text>Transaksi Batal</Text>
            </View>
          )}
        </View>

        <View style={{height: 40}} />
        <Tombol
          text="OK"
          warna={Konstanta.warna.satu}
          onPress={() => navigation.navigate('FrbTrKoi')}
        />
      </View>
    </ScrollView>
  );
};

export default FrbTrDetailKoi;

const styles = StyleSheet.create({
  container: {padding: 20},
  contJudul: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  judul: {textAlign: 'center', fontWeight: 'bold'},
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
