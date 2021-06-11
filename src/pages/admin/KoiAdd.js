import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Input, BottomSheet, ListItem, Button} from 'react-native-elements';
import {generateid} from '../../fungsi/Fungsi';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import AmbilFoto from '../../komponen/AmbilFoto';

const lebar = 800;
const tinggi = Math.floor(lebar * 1.3);

const ProdukSatuanAdd = () => {
  const [tbData, setTbData] = useState({});
  const [imgIndex, setImgIndex] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');

  function resetData() {
    const gid = generateid('KOI', 4);
    const initTbData = {
      id: gid,
      img: gid + '.jpg',
      tampil: true,
      status: 'ready',
    };
    setTbData(initTbData);
    setImgDetail([]);
  }

  useEffect(() => {
    resetData();
    setIsLoading(false);
  }, []);

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  function simpan() {
    if (!tbData.nama) {
      Alert.alert('PERHATIAN', 'Nama harus diisi');
      return;
    }

    if (!tbData.harga) {
      Alert.alert('PERHATIAN', 'Harga harus diisi');
      return;
    }

    if (imgDetail.length === 0) {
      Alert.alert('PERHATIAN', 'minimal upload 1 Foto Detail!');
      return;
    }

    setTProses('Start Proses Simpan Data');
    setIsLoading(true);
    setDb();
  }

  // async function prosesArr() {
  //   let hitung = 0;
  //   for (const item of imgDetail) {
  //     try {
  //       const tref = `/produk/${tbData.id}/detail${hitung}.jpg`;
  //       setTProses(prev => prev + `\n ${tref} ....`);
  //       await storage().ref(tref).putFile(item.uri);
  //       setTProses(prev => prev + 'SUKSES');
  //       hitung++;
  //     } catch (error) {
  //       Alert.alert('ERROR', error.message);
  //       setIsLoading(false);
  //     }
  //   }
  //   setDb();
  //   //resetData();
  // }

  function setDb() {
    setTProses(prev => prev + '\nMenyimpan ke database...');
    database()
      .ref('/produkSatuan/' + tbData.id)
      .set({
        nama: tbData.nama,
        jenis: tbData.jenis,
        harga: Number(tbData.harga),
        linkYoutube: tbData.linkYoutube,
        status: tbData.status,
        tampil: tbData.tampil,
        deskripsi: tbData.deskripsi,
      })
      .then(() => {
        setTProses(prev => prev + 'SUKSES');
        Alert.alert('SUKSES', 'Sukses Update Data');
        setIsLoading(false);
        resetData();
      })
      .catch(e => {
        Alert.alert('ERROR', e.message);
        setIsLoading(false);
      });
  }

  return (
    <View>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Input label="Produk ID" value={tbData.id} disabled />
          <Input
            label="Nama"
            value={tbData.nama}
            onChangeText={text => updateTbData('nama', text)}
          />
          <Input
            label="Jenis"
            value={tbData.jenis}
            onChangeText={text => updateTbData('jenis', text)}
          />
          <Input
            label="Harga"
            keyboardType="numeric"
            value={tbData.harga}
            onChangeText={text => updateTbData('harga', text)}
          />
          <Input
            label="Link Youtube"
            value={tbData.linkYoutube}
            onChangeText={text => updateTbData('linkYoutube', text)}
          />
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={tbData.deskripsi}
            onChangeText={text => updateTbData('deskripsi', text)}
            textAlignVertical="top"
            style={styles.deskripsi}
          />

          <AmbilFoto
            imgDetail={imgDetail}
            setImgDetail={setImgDetail}
            setIsLoading={setIsLoading}
            produkID={tbData.id}
            onEdit={true}
          />

          <Button
            title="Simpan"
            type="outline"
            onPress={simpan}
            containerStyle={{marginTop: 20}}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading keterangan={tProses} />}
    </View>
  );
};

export default ProdukSatuanAdd;
const styles = StyleSheet.create({
  container: {padding: 10, margin: 10, backgroundColor: 'white'},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
  label: {marginLeft: 15, fontWeight: 'bold', color: 'gray'},
  kotak: {
    width: 100,
    height: 100,
    backgroundColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {width: 90, height: 90, resizeMode: 'cover'},
  wrapKotak: {
    width: 100,
    height: 100,
    backgroundColor: '#d1d1d1',
    padding: 5,
  },
  kotakKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'gray',
    borderRadius: 10,
  },
  row: {flexDirection: 'row'},
  set: {paddingVertical: 5, paddingHorizontal: 10},
  tset: {color: Konstanta.warna.satu, fontWeight: 'bold'},
  deskripsi: {
    borderColor: 'gray',
    borderRadius: 3,
    borderWidth: 0.6,
    marginBottom: 10,
  },
});
