import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Input, Button, BottomSheet, ListItem} from 'react-native-elements';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Konstanta from '../../fungsi/Konstanta';
import noImage from '../../assets/noImage.jpg';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Loading from '../../komponen/Loading';

const lebar = Dimensions.get('window').width;

const Setting = () => {
  const [tbData, setTbData] = useState({});
  const [imgBanners, setImgBanners] = useState([]);
  const [infoWelcome, setInfoWelcome] = useState({});
  const [imgIndex, setImgIndex] = useState(0);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getData();
    getBanner();
    // listFilesAndDirectories(storage().ref('banner')).then(() => {
    //   console.log('selesai');
    // });
  }, []);

  function getData() {
    const dbRef = database().ref('/setting');
    dbRef.once('value').then(snapshot => {
      setTbData(snapshot.val());
      setInfoWelcome(snapshot.val().infoWelcome);
    });
  }

  function getBanner() {
    const dbRef = database().ref('/banner');
    dbRef.once('value').then(snapshot => {
      setImgBanners(snapshot.val());
    });
  }

  function listFilesAndDirectories(rfc, pageToken) {
    return rfc.list({pageToken}).then(result => {
      setImgBanners([]);
      result.items.forEach(ref => {
        ref
          .getDownloadURL()
          .then(url => {
            console.log(url);
            setImgBanners(prev => [...prev, {uri: url}]);
          })
          .catch(e => {
            console.log(e);
          });
      });

      if (result.nextPageToken) {
        return listFilesAndDirectories(rfc, result.nextPageToken);
      }

      return Promise.resolve();
    });
  }

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  function updateInfoWelcome(key, val) {
    setInfoWelcome(prev => ({...prev, [key]: val}));
  }

  function simpan() {
    let tmp = {...tbData};
    tmp.infoWelcome = infoWelcome;
    const ref = database().ref('/setting');
    ref
      .set(tmp)
      .then(() => Alert.alert('OK', 'Sukses update data'))
      .catch(e => console.log(e));
  }

  //==========================================
  function getImg(i) {
    setImgIndex(i);
    setBottomVisible(true);
  }

  const settingImg = {
    mediaType: 'photo',
    includeBase64: false,
    maxWidth: 800,
    maxHeight: 400,
  };

  const memprosesImg = hasil => {
    if (!hasil.didCancel) {
      const ast = hasil.assets[0];
      uploadImage(ast.uri);
    }
  };

  async function uploadImage(uri) {
    setIsLoading(true);
    const tref = `/banner/banner${imgIndex + 1}.jpg`;
    const stRef = storage().ref(tref);
    await stRef.putFile(uri).catch(error => {
      throw error;
    });
    const url = await stRef.getDownloadURL().catch(error => {
      throw error;
    });
    console.log(url);
    let idbanner = 'banner' + (imgIndex + 1);
    let namabanner = 'slide' + (imgIndex + 1);
    let tempArr = [...imgBanners];
    tempArr[imgIndex] = {id: idbanner, img: url, nama: namabanner};
    setImgBanners(tempArr);
    const ref = database().ref('/banner');
    ref
      .set(tempArr)
      .then(() => Alert.alert('OK', 'Sukses upload Image'))
      .catch(e => console.log(e))
      .finally(() => setIsLoading(false));
  }

  function ambilKamera() {
    setBottomVisible(false);
    launchCamera(settingImg, hasil => {
      memprosesImg(hasil);
    });
  }

  function ambilGaleri() {
    setBottomVisible(false);
    launchImageLibrary(settingImg, hasil => {
      memprosesImg(hasil);
    });
  }

  const bottomList = [
    {title: 'Ambil Kamera...', onPress: () => ambilKamera()},
    {title: 'Ambil Galeri...', onPress: () => ambilGaleri()},
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setBottomVisible(false),
    },
  ];
  return (
    <View>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.label}>Alamat Farm</Text>
          <TextInput
            onChangeText={t => updateTbData('alamatku', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {tbData.alamatku}
          </TextInput>
          <Text style={styles.label}>Keterangan Lelang</Text>
          <TextInput
            onChangeText={t => updateTbData('infoLelang', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {tbData.infoLelang}
          </TextInput>
          <Text style={styles.label}>Keterangan Transaksi KOI</Text>
          <TextInput
            onChangeText={t => updateTbData('infoTransaksiKoi', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {tbData.infoTransaksiKoi}
          </TextInput>
          <Text style={styles.label}>Keterangan Transaksi</Text>
          <TextInput
            onChangeText={t => updateTbData('infoTransaksi', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {tbData.infoTransaksi}
          </TextInput>
          <Input
            onChangeText={t => updateInfoWelcome('judul', t)}
            label="Judul Info di Home"
            value={infoWelcome.judul}
          />
          <Text style={styles.label}>Isi Info di HOME</Text>
          <TextInput
            onChangeText={t => updateInfoWelcome('isi', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {infoWelcome.isi}
          </TextInput>
          <Text style={styles.label}>Peraturan Lelang</Text>
          <TextInput
            onChangeText={t => updateTbData('aturanLelang', t)}
            style={styles.textP}
            multiline
            numberOfLines={4}>
            {tbData.aturanLelang}
          </TextInput>
          <Button title="Simpan" onPress={simpan} />
          <View style={styles.boxBanner}>
            {imgBanners.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => getImg(i)}
                  style={styles.kotak}>
                  <Image source={{uri: v.img}} style={styles.image} />
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => getImg(imgBanners.length)}
              style={styles.kotak}>
              <Image source={noImage} style={styles.image} />
            </TouchableOpacity>
          </View>
          {/* <Input title="Isi Info di Home" value={tbData.infoWelcome.isi} /> */}
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={bottomVisible}
        containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
        {bottomList.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
      {isLoading && <Loading />}
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {padding: 20},
  label: {marginLeft: 15, fontWeight: 'bold', color: 'gray'},
  textP: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  boxBanner: {marginTop: 20},
  kotak: {
    width: lebar - 40,
    height: lebar / 2 - 40,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {width: lebar - 50, height: lebar / 2 - 50, resizeMode: 'cover'},
  kotakKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'gray',
    borderRadius: 10,
  },
});
