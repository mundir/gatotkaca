/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';
import Carousel from '../../komponen/Carousel';
import CardLelang from '../../komponen/CardLelang';
import CardProdukSatuan from '../../komponen/CardProdukSatuan';
import Konstanta from '../../fungsi/Konstanta';
import {tunggu} from '../../fungsi/Fungsi';
import logo from '../../assets/jkc.png';
import moment from 'moment';
import CardLelangAkan from '../../komponen/CardLelangAkan';
import Headerku from '../../komponen/Headerku';

const lebar = Dimensions.get('window').width;
const tinggi = Dimensions.get('window').height;
const sekarang = moment();

const Dashboard = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [splashScreen, setSplashScreen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tbLelangSedang, setTbLelangSedang] = useState({});
  const [tbLelangAkan, setTbLelangAkan] = useState({});
  const [tbProdukSatuan, setTbProdukSatuan] = useState({});
  const [tbKategori, setTbKategori] = useState([]);
  const [SK, setSK] = useState('');
  const [imgKat, setImgKat] = useState({});

  const updateRef = React.useRef(false);

  React.useEffect(() => {
    tunggu(2000).then(() => setSplashScreen(false));

    getTbKategori();
    getTbAkan();

    const refTerbaru = database().ref('lelangTerbaru');
    const dtLelangTerbaru = refTerbaru.on('value', snapshot => {
      const hasil = snapshot.val();
      if (updateRef.current) {
        ToastAndroid.showWithGravity(
          `${hasil.namaLelang} UPBID ${hasil.bid} oleh ${hasil.namaUser}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      updateRef.current = hasil;
    });

    const refInfo = database().ref('/setting/infoWelcome');
    const updateInfo = refInfo.on('value', snapshot => {
      snapshot.exists() && setSK(snapshot.val());
    });

    const refLelang = database()
      .ref('/lelang')
      .orderByChild('status')
      .equalTo('sedang');

    const dtLelangSedang = refLelang.on('value', snapshot => {
      if (snapshot.exists()) {
        setTbLelangSedang(snapshot.val());
      }
    });

    const refProduk = database()
      .ref('/produkSatuan')
      .orderByChild('tampil')
      .equalTo(true);
    const updateProduk = refProduk.on('value', snapshot => {
      if (snapshot.exists()) {
        setTbProdukSatuan(snapshot.val());
      }
    });

    // Stop listening for updates when no longer required
    return () => {
      refInfo.off('value', updateInfo);
      refTerbaru.off('value', dtLelangTerbaru);
      refLelang.off('value', dtLelangSedang);
      refProduk.off('value', updateProduk);
      updateRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    // cek status pada lelang akan
    Object.keys(tbLelangAkan).forEach(key => {
      const dt = tbLelangAkan[key];
      const mulai = moment(dt.mulai);
      var secondsDiff = mulai.diff(sekarang, 'seconds');
      if (secondsDiff < 0) {
        if (user.isAdmin) {
          updateStatus(key);
        }
        delete tbLelangAkan[key];
      }
    });
  }, [tbLelangAkan]);

  // React.useEffect(() => {
  //   if (rowUpdate !== null) {
  //     const isID = rowUpdate.id;
  //     let t = tbLelangSedang[isID];
  //     t.lastBid = rowUpdate.bid;
  //     setTbLelangSedang(prev => ({...prev, [isID]: t}));
  //   }
  // }, [rowUpdate]);

  function updateStatus(id) {
    const refLelang = database().ref('lelang/' + id);
    refLelang.update({status: 'sedang'}).then(() => null);
  }

  const onRefresh = React.useCallback(() => {
    getTbAkan();
    setRefreshing(false);
  }, []);

  function getTbAkan() {
    database()
      .ref('/lelang')
      .orderByChild('status')
      .equalTo('akan')
      .once('value')
      .then(snapshot => {
        snapshot.exists() ? setTbLelangAkan(snapshot.val()) : null;
      });
  }

  function getTbKategori() {
    database()
      .ref('/kategori')
      .orderByChild('urutan')
      .once('value')
      .then(snapshot => {
        let tmpArr = [];
        snapshot.forEach(v => {
          tmpArr.push({...v.val(), id: v.key});
        });
        setTbKategori(tmpArr);
      });
  }

  return (
    <View style={{flex: 1}}>
      <Headerku
        judul="jawa koi center"
        badgeValue={0}
        icon="shopping-basket"
        onPressKanan={() => navigation.navigate('Keranjang')}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Carousel />
        <View style={styles.cardSK}>
          <Text style={styles.skHai}>Hai, {user.displayName}</Text>
          <Text style={styles.skJudul}>{SK.judul}</Text>
          <Text style={styles.skIsi}>{SK.isi}</Text>
        </View>

        {tbKategori.length > 0 && (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>KATEGORI</Text>
            </View>
            <View style={styles.rowKategori}>
              <ScrollView horizontal={true}>
                {tbKategori.map((v, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() =>
                        navigation.navigate(
                          v.id === 'KOI' ? 'ProdukSatuan' : 'Produk',
                          {
                            kategori: v.id,
                            namaKategori: v.nama,
                          },
                        )
                      }>
                      <View style={styles.boxAvatar}>
                        <Image
                          source={{
                            uri: v.img,
                          }}
                          style={styles.imgKat}
                        />
                        <Text
                          numberOfLines={3}
                          lineBreakMode="tail"
                          style={styles.tKat}>
                          {v.nama}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {tbLelangSedang && Object.keys(tbLelangSedang).length > 0 && (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>LELANG TERBARU</Text>
            </View>
            <View style={styles.containerProducts}>
              {Object.keys(tbLelangSedang).map((key, i) => {
                return (
                  <View key={key}>
                    <CardLelang
                      dtkey={key}
                      data={tbLelangSedang[key]}
                      onPressDetail={() =>
                        navigation.navigate('LelangDetail', {lelangID: key})
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {tbLelangAkan && Object.keys(tbLelangAkan).length > 0 && (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>LELANG SELANJUTNYA</Text>
            </View>
            <View style={styles.containerProducts}>
              {Object.keys(tbLelangAkan).map((key, i) => {
                return (
                  <View key={key}>
                    <CardLelangAkan
                      dtkey={key}
                      data={tbLelangAkan[key]}
                      onPressDetail={() =>
                        navigation.navigate('LelangDetailAkan', {lelangID: key})
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {tbProdukSatuan && Object.keys(tbProdukSatuan).length > 0 && (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>JUAL KOI</Text>
            </View>
            <View style={styles.containerProducts}>
              {Object.keys(tbProdukSatuan).map((key, i) => {
                return (
                  <View key={key}>
                    <CardProdukSatuan
                      dtKey={key}
                      data={tbProdukSatuan[key]}
                      onDetail={() =>
                        navigation.navigate('ProdukSatuanDetail', {
                          produkID: key,
                        })
                      }
                      onBeli={() =>
                        navigation.navigate('ProdukSatuanDetail', {
                          produkID: key,
                        })
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
      {splashScreen && (
        <View style={styles.splashScreen}>
          <Image source={logo} style={{width: 200, resizeMode: 'contain'}} />
          <ActivityIndicator size="small" color={Konstanta.warna.satu} />
        </View>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  splashScreen: {
    width: lebar,
    height: tinggi,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  timeout: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skJudul: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: Konstanta.warna.satu,
  },
  skHai: {color: Konstanta.warna.text, textAlign: 'center'},
  skIsi: {color: Konstanta.warna.text},
  container: {flexDirection: 'column'},
  card: {backgroundColor: 'white', marginVertical: 5},
  cardSK: {backgroundColor: 'white', marginVertical: 5, padding: 10},
  header: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: Konstanta.warna.disabled,
  },
  theader: {fontWeight: 'bold', color: Konstanta.warna.satu, fontSize: 16},
  rowKategori: {padding: 10},
  boxAvatar: {
    marginHorizontal: 2,
    alignItems: 'center',
  },
  imgKat: {width: 100, height: 100, borderRadius: 50},
  tKat: {width: 110, textAlign: 'center'},
  containerProducts: {flexDirection: 'row', flexWrap: 'wrap'},
  isLoading: {
    position: 'absolute',
    width: lebar,
    height: tinggi,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSK: {
    alignItems: 'center',
    // borderColor: Konstanta.warna.satu,
    color: 'red',
    borderWidth: 1,
    paddingVertical: 7,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
    // backgroundColor: 'white',
  },
  tBtnSK: {
    color: Konstanta.warna.satu,
    fontStyle: 'italic',
  },
  btnLainnya: {
    alignItems: 'center',
    backgroundColor: Konstanta.warna.satu,
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  tBtnLainnya: {
    color: 'white',
    fontStyle: 'italic',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
  },
  btnWA: {
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 40,
    marginVertical: 10,
  },
  btnOK: {
    alignItems: 'center',
    borderColor: Konstanta.warna.disabled,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 40,
    marginVertical: 10,
  },
  tBtnWA: {color: 'green'},
  tJudulCari: {
    textAlign: 'center',
    paddingVertical: 5,
    marginTop: 5,
    color: Konstanta.warna.text,
  },
  btnCari: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Konstanta.warna.disabled,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  tCari: {color: Konstanta.warna.disabled},
  boxIcon: {justifyContent: 'center', paddingHorizontal: 5},
});
