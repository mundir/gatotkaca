import React, {useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Modal,
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

const lebar = Dimensions.get('window').width;

const LelangDetailAkan = ({navigation, route}) => {
  const lelangID = route.params.lelangID;
  const reference = storage().ref(`produk/${lelangID}`);
  let imgID = 0;

  const [showDetail, setShowDetail] = useState(false);
  const [tbData, setTbData] = useState({});
  const [tempBid, setTempBid] = useState(0);
  const [lastBid, setLastBid] = useState(0);
  const [penambahanBid, setPenambahanBid] = useState(0);
  const [selisihDetik, setSelisihDetik] = useState(null);
  const [listImg, setListImg] = useState([]);
  const [indexImg, setIndexImg] = useState(0);

  React.useEffect(() => {
    getDt();

    listFilesAndDirectories(reference).then(() => {
      console.log('selesai');
    });
  }, []);

  function getDt() {
    database()
      .ref('/lelang/' + lelangID)
      .once('value')
      .then(snapshot => {
        const hasil = snapshot.val();
        setTbData(hasil);
        setPenambahanBid(hasil.kelipatan);
        setLastBid(hasil.lastBid);
        setTempBid(hasil.lastBid + hasil.kelipatan);
        const sekarang = moment();
        const mulai = moment(hasil.mulai);
        var secondsDiff = mulai.diff(sekarang, 'seconds');
        console.log(secondsDiff);
        setSelisihDetik(secondsDiff);
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
        setListImg(prev => [...prev, {id: imgID, url: url}]);
        imgID++;
      })
      .catch(e => {
        console.log(e);
      });
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
    <>
      <ScrollView>
        <FlatList
          data={listImg}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          pagingEnabled={true}
          horizontal={true}
          extraData={indexImg}
        />
        <Card>
          <Text style={styles.produkNama}>{tbData.nama}</Text>

          <View>
            <Text style={styles.tBidKelipatan}>
              Dimulai Pada: {moment(tbData.mulai).format('DD/MM/YYYY HH:mm')}
            </Text>
            {selisihDetik > 0 && (
              <View style={styles.boxCountdown}>
                <CountDown until={selisihDetik} size={20} />
              </View>
            )}
            <Text style={styles.tBidKelipatan}>
              Kelipatan BID: {ribuan(tbData.kelipatan)}
            </Text>
            <Text style={styles.tBidLast}>
              Open BID: {ribuan(tbData.openBid)}
            </Text>
          </View>
        </Card>
      </ScrollView>
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
    </>
  );
};

export default LelangDetailAkan;

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
  // boxCountdown: {paddingVertical: 25},
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
