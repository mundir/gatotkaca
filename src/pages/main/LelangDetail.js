import React, {useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ActivityIndicator,
  Linking,
  Button,
} from 'react-native';
import database from '@react-native-firebase/database';
import {Card} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import {ribuan} from '../../fungsi/Fungsi';
import Icon from 'react-native-vector-icons/FontAwesome';
import Konstanta from '../../fungsi/Konstanta';
import moment from 'moment';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {AuthContext} from './AuthProvider';
import ShareImg from '../../komponen/ShareImg';
import TanyakanWA from '../../fungsi/TanyakanWA';

const lebar = Dimensions.get('window').width;

const LelangDetail = ({navigation, route}) => {
  const {user} = React.useContext(AuthContext);
  const lelangID = route.params.lelangID;
  const reference = storage().ref(`produk/${lelangID}`);
  let imgID = 0;

  const [showDetail, setShowDetail] = useState(false);
  const [tbData, setTbData] = useState({});
  const [tbPeserta, setTbPeserta] = useState({});
  const [tempBid, setTempBid] = useState(0);
  const [lastBid, setLastBid] = useState(0);
  const [penambahanBid, setPenambahanBid] = useState(0);
  const [selisihDetik, setSelisihDetik] = useState(0);
  const [listImg, setListImg] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [indexImg, setIndexImg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSedang, setIsSedang] = useState(false);
  const [info, setInfo] = useState('');
  const [tampilShoot, setTampilShoot] = useState(false);
  React.useEffect(() => {
    getInfo();
    listFilesAndDirectories(reference).then(() => {
      console.log('selesai');
    });

    const refData = database().ref('/lelang/' + lelangID);

    const getData = refData.on('value', snapshot => {
      if (snapshot.exists()) {
        const hasil = snapshot.val();
        setTbData(hasil);
        setPenambahanBid(hasil.kelipatan);
        const sekarang = moment();
        const selesai = moment(hasil.selesai);
        var secondsDiff = selesai.diff(sekarang, 'seconds');
        setSelisihDetik(secondsDiff);
        secondsDiff > 0 ? setIsSedang(true) : setIsSedang(false);
        setLastBid(hasil.lastBid);
        setTempBid(hasil.lastBid + hasil.kelipatan);
      }
    });

    const refPeserta = database().ref(`/lelang/${lelangID}/peserta`);

    const getPeserta = refPeserta.orderByChild('bid').on('value', snapshot => {
      const hasil = snapshot.val();
      if (snapshot.exists()) {
        setTbPeserta(hasil);
      }
    });

    return () => {
      refData.off('value', getData);
      refPeserta.off('value', getPeserta);
    };
  }, []);

  // function getDt() {
  //   database()
  //     .ref('/lelang/' + lelangID)
  //     .once('value')
  //     .then(snapshot => {
  //       const hasil = snapshot.val();
  //       setTbData(hasil);
  //       setPenambahanBid(hasil.kelipatan);
  //       const sekarang = moment();
  //       const selesai = moment(hasil.selesai);
  //       var secondsDiff = selesai.diff(sekarang, 'seconds');
  //       setSelisihDetik(secondsDiff);
  //     });
  // }

  function getInfo() {
    database()
      .ref('setting/infoLelang')
      .once('value')
      .then(snapshot => {
        setInfo(snapshot.val());
      });
  }

  function listFilesAndDirectories(rfc, pageToken) {
    return rfc.list({pageToken}).then(result => {
      setListImg([]);
      result.items.forEach(ref => {
        getImg(ref.fullPath);
      });

      if (result.nextPageToken) {
        return listFilesAndDirectories(rfc, result.nextPageToken);
      }

      return Promise.resolve();
    });
  }

  function getImg(tRef) {
    const refImg = storage().ref(tRef);
    refImg
      .getDownloadURL()
      .then(url => {
        if (listImg.length === 0) {
          setMainImage({uri: url});
        }
        setListImg(prev => [...prev, {id: imgID, url: url}]);
        imgID++;
      })
      .catch(e => {
        console.log(e);
      });
  }

  function kurangi() {
    if (tempBid > lastBid + penambahanBid) {
      setTempBid(prev => prev - penambahanBid);
    }
  }

  function tambahi() {
    setTempBid(prev => prev + penambahanBid);
  }

  function handleUpdateBid() {
    Alert.alert(
      'PERHATIAN',
      'Apakah anda yakin akan melakukan UpBID Rp' + ribuan(tempBid),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => updateBid()},
      ],
    );
  }

  function updateBid() {
    setIsLoading(true);
    database()
      .ref('/lelang/' + lelangID)
      .update({
        lastBid: tempBid,
        lastUserID: user.uid,
        lastUserNama: user.displayName,
        updateOn: new Date().toISOString(),
      })
      .then(simpanLelangPeserta());
  }

  function simpanLelangPeserta() {
    database()
      .ref(`/lelang/${lelangID}/peserta/${user.uid}`)
      .set({
        userID: user.uid,
        nama: user.displayName,
        bid: tempBid,
        updateOn: new Date().getTime(),
      })
      .then(simpanLelangTerbaru());
  }

  function simpanLelangTerbaru() {
    const rf = database().ref('/lelangHistory').push();
    rf.set({
      id: lelangID,
      bid: tempBid,
      namaLelang: tbData.nama,
      namaUser: user.displayName,
      updateOn: new Date().getTime(),
    }).then(() => setIsLoading(false));
  }

  function perhatian() {
    // setIsSedang(false);
    Alert.alert('INFO', 'Sesi lelang telah berakhir');
    navigation.goBack();
  }
  function handleShowDetail(i) {
    setIndexImg(i);
    setShowDetail(true);
  }

  const renderItem = ({item, index}) => (
    <TouchableOpacity onPress={() => handleShowDetail(index)}>
      <FastImage
        style={styles.img}
        source={{uri: item.url}}
        resizeMode={FastImage.resizeMode.contain}
      />
    </TouchableOpacity>
  );
  return (
    <View>
      <ScrollView>
        <View>
          <FlatList
            data={listImg}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            pagingEnabled={true}
            horizontal={true}
            extraData={indexImg}
          />
          {/* <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setTampilShoot(true)}
              style={{
                padding: 5,
                backgroundColor: Konstanta.warna.dua,
              }}>
              <Icon name="share-alt" color="white" size={20} />
            </TouchableOpacity>
            <Text>Bagikan</Text>
          </View> */}
        </View>
        <Card>
          <Text style={styles.produkNama}>{tbData.nama}</Text>
          {tbData.deskripsi && <Text>{tbData.deskripsi}</Text>}
          {tbData.ytb && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(tbData.ytb);
              }}
              style={{
                backgroundColor: 'mistyrose',
                padding: 10,
                marginHorizontal: 10,
                marginVertical: 5,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Icon name="youtube" size={20} color="red" />
              <Text style={{color: 'red', fontWeight: 'bold'}}>
                {'  '}Lihat di YOUTUBE
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setTampilShoot(true);
            }}
            style={{
              backgroundColor: 'skyblue',
              padding: 10,
              marginHorizontal: 10,
              marginVertical: 5,
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Icon name="share-alt" size={20} color="blue" />
            <Text style={{color: 'blue', fontWeight: 'bold'}}>
              {'  '}Bagikan Sosmed
            </Text>
          </TouchableOpacity>
          {isSedang ? (
            <View>
              <View style={styles.boxCountdown}>
                <CountDown
                  until={selisihDetik}
                  onFinish={perhatian}
                  size={20}
                />
              </View>

              <View>
                <Text style={styles.tBidKelipatan}>
                  Kelipatan BID: {ribuan(tbData.kelipatan)}
                </Text>
                <Text style={styles.tBidLast}>
                  BID Tertinggi Sementara: {ribuan(lastBid)}
                </Text>
              </View>
              <View style={styles.rowBid}>
                <View style={styles.colbidPM}>
                  <TouchableOpacity
                    onPress={kurangi}
                    style={[styles.colInner, styles.btnPM]}>
                    <Icon name="minus" size={14} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.colbidText}>
                  <View style={[styles.colInner, styles.tLastBid]}>
                    <Text style={styles.tMybid}>{ribuan(tempBid)}</Text>
                  </View>
                </View>
                <View style={styles.colbidPM}>
                  <TouchableOpacity
                    onPress={tambahi}
                    style={[styles.colInner, styles.btnPM]}>
                    <Icon name="plus" size={14} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.colbidBtnOK}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="red" />
                  ) : (
                    <TouchableOpacity
                      onPress={handleUpdateBid}
                      style={[styles.colInner, styles.btnBidOK]}>
                      <Text style={styles.tombolt}>BID</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={{marginTop: 10}}>
              <Text style={styles.tBidKelipatan}>PEMENANG LELANG</Text>
              <Text style={styles.tBidLast}>{tbData.lastUserNama}</Text>
              <Text style={styles.tBidLast}>BID: {ribuan(tbData.lastBid)}</Text>
            </View>
          )}
        </Card>
        {!isSedang && tbData.lastUserID === user.uid && (
          <View>
            <Card>
              <Card.Title>INFO PEMENANG</Card.Title>
              <Card.Divider />
              <Text>{info}</Text>
            </Card>
            <Card>
              <Card.Title>PEMBAYARAN</Card.Title>
              <Text>Silahkan lakukan pembayaran dengan metode berikut</Text>
              <View style={{padding: 5}}>
                <Button
                  title="PEMBAYARAN"
                  onPress={() => navigation.navigate('Pembayaran')}
                />
              </View>
              <View style={{padding: 5}}>
                <Button
                  title="WA ADMIN"
                  color="green"
                  onPress={() =>
                    TanyakanWA(
                      `Pembayaran pemenang lelang ${tbData.nama} atas nama ${user.displayName}`,
                    )
                  }
                />
              </View>
            </Card>
          </View>
        )}
        <Card>
          <Card.Title>PESERTA LELANG</Card.Title>
          <Card.Divider />

          {Object.keys(tbPeserta).length === 0 ? (
            <Text style={{textAlign: 'center', color: 'orange'}}>
              Belum ada peserta lelang
            </Text>
          ) : (
            <View>
              {Object.keys(tbPeserta).map((key, i) => {
                const dt = tbPeserta[key];
                return (
                  <View style={styles.rowPeserta} key={key}>
                    <Text style={[styles.rowPesertaItem, {width: 20}]}>
                      {i + 1}
                    </Text>
                    <Text
                      style={[styles.rowPesertaItem, {flex: 1, marginLeft: 4}]}>
                      {dt.nama}
                    </Text>
                    <Text
                      style={[
                        styles.rowPesertaItem,
                        {
                          width: 70,
                          textAlign: 'right',
                        },
                      ]}>
                      {ribuan(dt.bid)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* <FlatList
              data={tbDataDetail}
              renderItem={renderPesertaItem}
              keyExtractor={item => item.id}
            /> */}
        </Card>
        <View style={{height: 30}} />
      </ScrollView>
      {tampilShoot && (
        <ShareImg
          src={mainImage}
          keterangan={`Ikuti lelang ${tbData.nama} Open Bid ${ribuan(
            tbData.openBid,
          )} di aplikasi Jawa Koi Center \nhttps://google.com`}
          setSelesai={setTampilShoot}
        />
      )}
      <Modal
        visible={showDetail}
        transparent={true}
        onRequestClose={() => setShowDetail(false)}>
        <ImageViewer
          imageUrls={listImg}
          index={indexImg}
          enableImageZoom={true}
        />
      </Modal>
    </View>
  );
};

export default LelangDetail;

const styles = StyleSheet.create({
  isloading: {justifyContent: 'center', alignItems: 'center', flex: 1},
  container: {padding: 5},
  card: {
    padding: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  produkNama: {
    fontSize: 18,
    color: Konstanta.warna.satu,
    textAlign: 'justify',
  },
  row: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowPeserta: {flexDirection: 'row', alignItems: 'center'},
  tPeserta: {fontSize: 14},
  boxCountdown: {paddingVertical: 25},
  tBidKelipatan: {
    fontSize: 14,
    textAlign: 'center',
    color: Konstanta.warna.text,
  },
  tBidLast: {
    fontSize: 16,
    textAlign: 'center',
    color: Konstanta.warna.satu,
  },
  rowBid: {flexDirection: 'row', height: 40, marginVertical: 5},
  kotak: {height: 50, width: 50},
  colbidPM: {flex: 3},
  colbidText: {
    flex: 8,
  },
  colbidBtnOK: {flex: 8},
  colInner: {
    flex: 1,
    borderRadius: 4,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPM: {backgroundColor: Konstanta.warna.dua},
  tLastBid: {
    backgroundColor: 'white',
    borderColor: Konstanta.warna.disabled,
    borderWidth: 0.5,
  },
  tMybid: {fontSize: 16, color: Konstanta.warna.satu, fontWeight: 'bold'},
  btnBidOK: {marginLeft: 5, backgroundColor: Konstanta.warna.satu},
  tterjual: {color: Konstanta.warna.disabled},
  thargaLama: {
    color: Konstanta.warna.disabled,
    textDecorationLine: 'line-through',
  },
  tharga: {fontSize: 18, color: Konstanta.warna.dua, fontWeight: 'bold'},
  tjudul: {fontWeight: 'bold', fontSize: 18, color: Konstanta.warna.satu},
  tdeskripsi: {color: Konstanta.warna.text},
  tombol: {
    height: 40,
    backgroundColor: Konstanta.warna.satu,
    justifyContent: 'center',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
  tombolt: {color: 'white', fontSize: 14, fontWeight: 'bold'},
  img: {width: lebar, height: lebar},
});
