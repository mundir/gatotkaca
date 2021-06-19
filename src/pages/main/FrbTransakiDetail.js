import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {Card} from 'react-native-elements';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';
import Tombol from '../../komponen/Tombol';

const FrbTransakiDetail = ({navigation, route}) => {
  const txID = route.params.txID;
  const {user} = React.useContext(AuthContext);
  const [tbParent, setTbParent] = useState({});
  const [tbData, setTbData] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [total, setTotal] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [info, setInfo] = useState('');

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    getDtInfo(isMount);
    return () => {
      isMount = false;
    };
  }, []);

  function getDt(isMount) {
    database()
      .ref('/transaksi/' + txID)
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            const hasil = snapshot.val();
            const barangs = hasil.produk;
            setTbParent(hasil);
            let arr = [];
            let thrg = 0;
            Object.keys(barangs).forEach(v => {
              const vitem = barangs[v];
              thrg += vitem.harga * vitem.qty;
              arr.push(vitem);
            });
            setTotalHarga(thrg);
            setTotal(thrg + hasil.ongkir);
            setTbData(arr);

            console.log(hasil);
          }
        }
      });
  }

  function getDtInfo(isMount) {
    database()
      .ref('/setting/infoTransaksi')
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            setInfo(snapshot.val());
          }
        }
      });
  }

  const wa = () => {
    const isi = 'Saya konfirmasi untuk transaksi ID ' + txID;
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
          const tbRef = database().ref('/transaksi/' + id);
          tbRef
            .update({status: 'batal'})
            .then(() => navigation.navigate('Transaksi'));
        },
      },
    ]);
  }

  function onOke() {
    navigation.goBack();
  }

  let hitung = 0;
  return (
    <>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <Card>
            <Card.Title>DAFTAR PESANAN</Card.Title>
            <Card.Divider />
            {tbData.map((v, i) => {
              hitung += 1;
              return (
                <View key={i} style={styles.row}>
                  <View style={{width: 30}}>
                    <Text>{hitung}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text>{v.produkNama}</Text>
                    <View style={styles.row}>
                      <Text>@ {ribuan(v.harga)}</Text>
                      <Text>x{v.qty}</Text>
                      <Text>Rp{ribuan(v.harga * v.qty)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>
          {tbParent.kurirData && (
            <Card>
              <Card.Title>KURIR</Card.Title>
              <Card.Divider />
              <View>
                <View style={styles.row2}>
                  <Text style={{width: 100}}>Operator</Text>
                  <Text style={styles.tVal2}>: {tbParent.kurirData.name}</Text>
                </View>
                <View style={styles.row2}>
                  <Text style={{width: 100}}>Jenis Layanan</Text>
                  <Text style={styles.tVal2}>
                    : {tbParent.kurirData.service} -{' '}
                    {tbParent.kurirData.description}
                  </Text>
                </View>
                <View style={styles.row2}>
                  <Text style={{width: 100}}>Ongkir</Text>
                  <Text style={[styles.tVal2, {color: 'red'}]}>
                    :{' '}
                    {tbParent.kurirData.cost
                      ? tbParent.kurirData.cost[0].value
                      : '-'}
                  </Text>
                </View>
                <View style={styles.row2}>
                  <Text style={{width: 120}}>Perkiraan sampai</Text>
                  <Text style={styles.tVal2}>
                    :{' '}
                    {tbParent.kurirData.cost
                      ? tbParent.kurirData.cost[0].etd
                      : '-'}{' '}
                    hari
                  </Text>
                </View>
                <View style={styles.row2}>
                  <Text style={{width: 100}}>Keterangan</Text>
                  <Text style={styles.tVal2}>
                    :{' '}
                    {tbParent.kurirData.cost
                      ? tbParent.kurirData.cost[0].note
                      : '-'}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          <Card>
            <View style={styles.row}>
              <Text>Total Harga</Text>
              <Text>{totalHarga}</Text>
            </View>
            <View style={styles.row}>
              <Text>Ongkir</Text>
              <Text>{tbParent.ongkir}</Text>
            </View>
            <View style={styles.row}>
              <Text>Total Bayar</Text>
              <Text style={{color: 'orangered', fontWeight: 'bold'}}>
                Rp{ribuan(tbParent.ongkir + totalHarga)}
              </Text>
            </View>
          </Card>
          <Card>
            <Card.Title>DATA PENERIMA</Card.Title>
            <Card.Divider />
            <View style={styles.row2}>
              <Text style={{width: 100}}>Nama</Text>
              <Text style={styles.tVal2}>: {user.displayName}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>HP / WA</Text>
              <Text style={styles.tVal2}>: {user.phoneNumber}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>Provinsi</Text>
              <Text style={styles.tVal2}>: {user.provinsi}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>Kab / Kota</Text>
              <Text style={styles.tVal2}>: {user.kotaNama}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>Alamat</Text>
              <Text style={styles.tVal2}>:</Text>
            </View>
            {user.alamat && user.kotaID ? (
              <Text style={styles.tVal}>{user.alamat}</Text>
            ) : (
              <View>
                <Text>Perhatian!</Text>
                <Text>
                  pesanan tidak dapat diproses jika alamat belum diatur.
                </Text>
                <Text>Silahkan atur alamat di Tab AKUN</Text>
              </View>
            )}
          </Card>

          {tbParent.status === 'proses' && (
            <Card>
              <Card.Title>INFO TRANSAKSI</Card.Title>
              <Card.Divider />
              <Text>{info}</Text>
            </Card>
          )}
          <Card>
            {tbParent.status === 'proses' && (
              <View style={styles.row}>
                <Tombol
                  text="INFO PEMBAYARAN"
                  warna="#075E54"
                  onPress={() => navigation.navigate('Pembayaran')}
                />
                <Tombol
                  text="Konf WA"
                  warna="#25D366"
                  onPress={wa}
                  marginHorizontal={5}
                />
                {/* <Tombol
                  text="Batalkan"
                  warna="red"
                  onPress={() => batalkan(txID)}
                /> */}
              </View>
            )}
            {tbParent.status === 'kirim' && (
              <View style={{alignItems: 'center'}}>
                <Text>Produk sedang dalam proses pengiriman.</Text>
                <Text>Jika produk sudah anda terima, klik tombol TERIMA</Text>
                <Tombol
                  text="TERIMA"
                  warna={Konstanta.warna.dua}
                  onPress={null}
                />
              </View>
            )}
            {tbParent.status === 'selesai' && (
              <View style={{alignItems: 'center'}}>
                <Text>Transaksi Selesai</Text>
              </View>
            )}
            {tbParent.status === 'batal' && (
              <View style={{alignItems: 'center'}}>
                <Text>Transaksi Batal</Text>
              </View>
            )}
          </Card>
          <View style={{height: 30}} />
        </ScrollView>

        {/* <View style={styles.contTotal}>
          <View>
            <Text style={styles.contTextA}>Total Harga</Text>
            <Text style={styles.contTextB}>Rp{ribuan(total)}</Text>
          </View>

          <TouchableOpacity style={styles.tombolProses} onPress={onOke}>
            <Text style={styles.textTombol}>OK</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

export default FrbTransakiDetail;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  row2: {flexDirection: 'row'},
  contTotal: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contTextA: {color: Konstanta.warna.text, fontSize: 10},
  contTextB: {color: Konstanta.warna.satu, fontSize: 18, fontWeight: 'bold'},
  tombolProses: {
    backgroundColor: Konstanta.warna.satu,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  textTombol: {color: 'white', fontWeight: 'bold'},
  tVal: {marginLeft: 5, fontStyle: 'italic', color: 'gray'},
  tVal2: {fontStyle: 'italic', color: 'gray'},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
});
