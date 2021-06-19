import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import {Card, ButtonGroup} from 'react-native-elements';
import Headerku from '../../komponen/Headerku';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';
import IconJne from '../../assets/jne.jpg';
import IconPos from '../../assets/pos.jpg';
import IconTiki from '../../assets/tiki.jpg';
import Loading from '../../komponen/Loading';

const textPengiriman = ['jne', 'pos', 'tiki'];
const berat = 1000;

const BuatPesanan = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const [tbData, setTbData] = useState([]);
  const [total, setTotal] = useState(0);
  const [harga, setHarga] = useState(0);
  const [indexJasaKirim, setIndexJasaKirim] = useState(0);
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dtOngkir, setDtOngkir] = useState([]);
  const [ongkir, setOngkir] = useState(0);
  const [selectedPengirim, setSelectedPengirim] = useState({});

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    getDtInfo(isMount);
    getCost(berat, textPengiriman[indexJasaKirim]);
    return () => {
      isMount = false;
    };
  }, []);

  function getDt(isMount) {
    database()
      .ref('/keranjang/' + user.uid)
      .orderByChild('isDibeli')
      .equalTo(true)
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            let arr = [];
            let tharga = 0;
            snapshot.forEach((v, i) => {
              const hasil = v.val();
              tharga += hasil.harga * hasil.qty;
              arr.push(hasil);
            });
            setTbData(arr);
            setHarga(tharga);
            setTotal(tharga);
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

  function getCost(brt, kurir) {
    setIsLoading(true);
    fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        key: '73393cdc6d1f5ae874fbfd442938d649',
      },
      body: JSON.stringify({
        origin: '255',
        destination: user.kotaID,
        weight: brt,
        courier: kurir,
      }),
    })
      .then(response => response.json())
      .then(json => {
        const hasil = json.rajaongkir.results[0];
        setDtOngkir(hasil);
        console.log(hasil.costs);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  function onOke() {
    if (!ongkir) {
      Alert.alert('PERHATIAN', 'Silahkan pilih jasa kirim');
      return;
    }
    let newOb = {
      userID: user.uid,
      userNama: user.displayName,
      status: 'proses',
      ongkir: ongkir,
      kurirKode: selectedPengirim.code,
      kurirService: selectedPengirim.service,
      kurirData: selectedPengirim,
      txDate: new Date().getTime(),
    };
    let produk = {};
    tbData.forEach((v, i) => {
      produk[v.produkID] = {...v};
      hapusKeranjang(v.produkID);
    });
    newOb.produk = produk;
    console.log(newOb);
    const newTransaksi = database().ref('/transaksi').push();
    newTransaksi.set(newOb).then(() => navigation.navigate('Transaksi'));
  }

  function hapusKeranjang(produkID) {
    database()
      .ref(`/keranjang/${user.uid}/${produkID}`)
      .set(null)
      .then(() => {
        console.log('barhasil delete row keranjang');
      });
  }
  function handlePengirim(i) {
    setIndexJasaKirim(i);
    getCost(1000, textPengiriman[i]);
  }

  function onPressJenisLayanan(code, name, dt) {
    setSelectedPengirim({...dt, code, name});
    setOngkir(dt.cost[0].value);
    setTotal(harga + dt.cost[0].value);
  }

  const jasa1 = () => <Image style={styles.imgIcon} source={IconJne} />;
  const jasa2 = () => <Image style={styles.imgIcon} source={IconPos} />;
  const jasa3 = () => <Image style={styles.imgIcon} source={IconTiki} />;
  const opsiKirim = [{element: jasa1}, {element: jasa2}, {element: jasa3}];
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
                <Text>Silahkan atur alamat di Tab AKUN. TAP DISINI</Text>
              </View>
            )}
          </Card>
          <Card>
            <Card.Title>JASA PENGIRIMAN</Card.Title>
            <View>
              <View style={styles.row2}>
                <Text style={{width: 100}}>Operator</Text>
                <Text style={styles.tVal2}>: {selectedPengirim.name}</Text>
              </View>
              <View style={styles.row2}>
                <Text style={{width: 100}}>Jenis Layanan</Text>
                <Text style={styles.tVal2}>
                  : {selectedPengirim.service} - {selectedPengirim.description}
                </Text>
              </View>
              <View style={styles.row2}>
                <Text style={{width: 100}}>Ongkir</Text>
                <Text style={[styles.tVal2, {color: 'red'}]}>
                  :{' '}
                  {selectedPengirim.cost ? selectedPengirim.cost[0].value : '-'}
                </Text>
              </View>
              <View style={styles.row2}>
                <Text style={{width: 120}}>Perkiraan sampai</Text>
                <Text style={styles.tVal2}>
                  : {selectedPengirim.cost ? selectedPengirim.cost[0].etd : '-'}{' '}
                  hari
                </Text>
              </View>
              <View style={styles.row2}>
                <Text style={{width: 100}}>Keterangan</Text>
                <Text style={styles.tVal2}>
                  :{' '}
                  {selectedPengirim.cost ? selectedPengirim.cost[0].note : '-'}
                </Text>
              </View>
            </View>

            <ButtonGroup
              onPress={i => handlePengirim(i)}
              selectedIndex={indexJasaKirim}
              buttons={opsiKirim}
              containerStyle={{height: 50}}
            />
            {dtOngkir.costs &&
              dtOngkir.costs.map((v, i) => (
                <View
                  key={i}
                  style={{
                    padding: 5,
                    borderColor: 'gray',
                    borderWidth: 0.7,
                    borderRadius: 5,
                    marginBottom: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      onPressJenisLayanan(dtOngkir.code, dtOngkir.name, v)
                    }>
                    <Text>
                      {v.service} - {v.description}
                    </Text>
                    {v.cost.map((vx, ix) => (
                      <View key={ix} style={{marginLeft: 10}}>
                        <Text>Ongkir: {vx.value}</Text>
                        <Text>Perkiraan sampai: {vx.etd} hari</Text>
                        <Text>Keterangan: {vx.note}</Text>
                      </View>
                    ))}
                  </TouchableOpacity>
                </View>
              ))}
          </Card>

          <Card>
            <Card.Title>INFO TRANSAKSI</Card.Title>
            <Card.Divider />
            <Text>{info}</Text>
          </Card>
        </ScrollView>

        <View style={styles.contTotal}>
          <View>
            <Text style={styles.contTextA}>Total Bayar</Text>
            <Text style={styles.contTextB}>Rp{ribuan(total)}</Text>
          </View>

          <TouchableOpacity style={styles.tombolProses} onPress={onOke}>
            <Text style={styles.textTombol}>Buat Pesanan</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && <Loading />}
    </>
  );
};

export default BuatPesanan;

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
