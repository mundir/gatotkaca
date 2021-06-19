import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Button,
  ToastAndroid,
  Alert,
} from 'react-native';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import Tombol from '../../komponen/Tombol';
import Produk from './Produk';
import ShareImg from '../../komponen/ShareImg';

const lebar = Dimensions.get('window').width;

const ProdukDetail = ({navigation, route}) => {
  const produkID = route.params.produkID;
  const {user} = React.useContext(AuthContext);
  const reference = storage().ref(`produk/${produkID}`);
  let imgID = 0;

  const [tbKey, setTbKey] = React.useState('');
  const [tbData, setTbData] = React.useState({});
  const [listImg, setListImg] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [indexImg, setIndexImg] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [tampilShoot, setTampilShoot] = useState(false);

  React.useEffect(() => {
    getDt();
    listFilesAndDirectories(reference).then(() => {
      console.log('selesai');
    });
  }, []);

  function getDt() {
    database()
      .ref('/produk/' + produkID)
      .once('value')
      .then(snapshot => {
        setTbKey(snapshot.key);
        setTbData(snapshot.val());
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

  function membeli() {
    let stok = tbData.stok;
    let inDt = {
      produkID: produkID,
      produkNama: tbData.nama,
      harga: tbData.harga,
      stok: stok,
      qty: 1,
      isDibeli: false,
    };
    const ref = database().ref(`/keranjang/${user.uid}/${produkID}`);
    ref.once('value').then(snapshot => {
      if (snapshot.exists()) {
        let qty = snapshot.val().qty;
        if (qty < stok) {
          inDt.qty = qty + 1;
          ref.set(inDt).then(() => {
            ToastAndroid.showWithGravity(
              `Menambahkan ${tbData.nama} kedalam keranjang. Total Qty: ${inDt.qty}`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          });
        } else {
          Alert.alert(
            'Perhatian',
            'Anda sudah mencapai pembelian maksimal.\nQty keranjang: ' + qty,
          );
        }
      } else {
        ref.set(inDt).then(() => {
          ToastAndroid.showWithGravity(
            `Menambahkan ${inDt.produkNama} kedalam keranjang. Total Qty: ${inDt.qty}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        });
      }
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
      {tampilShoot && (
        <ShareImg
          src={mainImage}
          keterangan={`dapatkan ${tbData.nama} dengan harga ${ribuan(
            tbData.harga,
          )} di aplikasi Jawa Koi Center \nhttps://google.com`}
          setSelesai={setTampilShoot}
        />
      )}
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
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.produkNama}>{tbData.nama}</Text>
            <View style={styles.row}>
              <Text>Stok: {tbData.stok}</Text>
              <Text>Terjual: {tbData.terjual ? tbData.terjual : 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.tharga}>
                Rp.
                {ribuan(tbData.harga)}
              </Text>
            </View>
          </View>
          {tbData.deskripsi !== '' && (
            <View style={[styles.card, {marginBottom: 20}]}>
              <Text style={styles.tjudul}>Deskripsi Produk</Text>
              <Text style={styles.tdeskripsi}>{tbData.deskripsi} </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <View style={{width: 150}}>
              <Button title="SHARE" onPress={() => setTampilShoot(true)} />
            </View>
            <View style={{width: 150}}>
              <Button
                title="BELI"
                color={Konstanta.warna.satu}
                onPress={membeli}
              />
            </View>
          </View>
        </View>
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

export default ProdukDetail;

const styles = StyleSheet.create({
  container: {padding: 5, marginBottom: 20},
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
  tterjual: {color: Konstanta.warna.disabled},
  thargaLama: {
    color: Konstanta.warna.disabled,
    textDecorationLine: 'line-through',
  },
  tharga: {fontSize: 18, color: Konstanta.warna.satu, fontWeight: 'bold'},
  tjudul: {fontWeight: 'bold', fontSize: 18, color: 'gray'},
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
