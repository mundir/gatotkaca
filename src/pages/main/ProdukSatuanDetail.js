import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage from 'react-native-fast-image';
import Tombol from '../../komponen/Tombol';
import TanyakanWA from '../../fungsi/TanyakanWA';
import Icon from 'react-native-vector-icons/FontAwesome';
import ShareImg from '../../komponen/ShareImg';

const lebar = Dimensions.get('window').width;

const ProdukSatuanDetail = ({navigation, route}) => {
  const produkID = route.params.produkID;
  const {user} = React.useContext(AuthContext);
  const reference = storage().ref(`produk/${produkID}`);
  let imgID = 0;

  const [tbKey, setTbKey] = React.useState('');
  const [tbData, setTbData] = React.useState({});
  const [listImg, setListImg] = useState([]);
  const [indexImg, setIndexImg] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [tampilShoot, setTampilShoot] = useState(false);

  React.useEffect(() => {
    getDt();
    listFilesAndDirectories(reference).then(() => {
      console.log('selesai');
    });
  }, []);

  function getDt() {
    database()
      .ref('/produkSatuan/' + produkID)
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

  function tanyaAdmin() {
    TanyakanWA(`Minta info tentang ${tbData.nama}`);
  }

  function prosesBeli() {
    if (!('ongkir' in user)) {
      Alert.alert(
        'PERHATIAN',
        'Untuk bertransaksi, silahkan atur alamat anda',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Akun');
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    if (user.ongkir == 0) {
      Alert.alert(
        'PERHATIAN',
        'Alamat pengiriman anda belum terjangkau. silahkan hubungi Admin',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              tanyaAdmin(
                `${user.kotaNama} - ${user.kotaID} belum terjangkau pengiriman`,
              );
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    Alert.alert(
      'BUAT PESANAN',
      `Apakah anda akan membeli ${tbData.nama} harga plus ongkir Rp${ribuan(
        tbData.harga + user.ongkir,
      )}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            membeli();
          },
        },
      ],
      {cancelable: false},
    );
  }

  function membeli() {
    const newTransaksi = database().ref('/transaksiKoi').push();
    const newKey = newTransaksi.key;
    const inDt = {
      userID: user.uid,
      userNama: user.displayName,
      status: 'proses',
      produkID: produkID,
      produkNama: tbData.nama,
      harga: tbData.harga,
      ongkir: user.ongkir,
      txDate: new Date().getTime(),
    };
    newTransaksi
      .set(inDt)
      .then(() => updateTbKoi(newKey))
      .catch(e => console.log(e));
  }

  function updateTbKoi(txID) {
    const refProduk = database().ref('/produkSatuan/' + produkID);
    refProduk
      .update({status: 'habis'})
      .then(() =>
        navigation.replace('TransaksiDetail', {produkID: produkID, txID: txID}),
      );
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
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.produkNama}>{tbData.nama}</Text>
            <Text style={styles.tterjual}>Jenis {tbData.jenis}</Text>
            {tbData.linkYoutube && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(tbData.linkYoutube);
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
            <View style={styles.row}>
              <Text>Harga: Rp{ribuan(tbData.harga)}</Text>
              {'ongkir' in user ? (
                user.ongkir ? (
                  <Text>Ongkir: Rp{ribuan(user.ongkir)}</Text>
                ) : (
                  <Text style={{color: 'red'}}>Ongkir: diluar jangkauan</Text>
                )
              ) : (
                <Text style={{color: 'red'}}>Ongkir: Belum diatur</Text>
              )}
            </View>
            <Text style={styles.harga}>
              Total Bayar: Rp
              {user.ongkir
                ? ribuan(tbData.harga + user.ongkir)
                : ribuan(tbData.harga)}
            </Text>
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
              padding: 10,
            }}>
            <View style={styles.contTombol}>
              <Tombol
                text="SHARE"
                warna={'skyblue'}
                onPress={() => setTampilShoot(true)}
              />
            </View>
            <View style={styles.contTombol}>
              <Tombol text="WA ADMIN" warna={'green'} onPress={tanyaAdmin} />
            </View>
            <View style={styles.contTombol}>
              <Tombol
                text="BELI"
                warna={Konstanta.warna.satu}
                onPress={prosesBeli}
              />
            </View>
          </View>
        </View>
        {tampilShoot && (
          <ShareImg
            src={mainImage}
            keterangan={`dapatkan ${tbData.nama} dengan harga ${ribuan(
              tbData.harga,
            )} di aplikasi Jawa Koi Center \nhttps://google.com`}
            setSelesai={setTampilShoot}
          />
        )}
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

export default ProdukSatuanDetail;

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
  },
  tterjual: {color: Konstanta.warna.disabled},
  thargaLama: {
    color: Konstanta.warna.disabled,
    textDecorationLine: 'line-through',
  },
  tharga: {fontSize: 18, color: Konstanta.warna.dua, fontWeight: 'bold'},
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
  contTombol: {flex: 1, padding: 4},
});
