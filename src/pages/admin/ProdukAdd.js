import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Input, Button, ButtonGroup, Overlay} from 'react-native-elements';
import {generateid} from '../../fungsi/Fungsi';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import AmbilFoto from '../../komponen/AmbilFoto';
import Dropdown from '../../komponen/Dropdown';

const btStatus = ['ready', 'habis', 'off'];

const ProdukAdd = () => {
  const [tbData, setTbData] = useState({});
  const [btStatusIdx, setBtStatusIdx] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');
  const [dtKategori, setDtKategori] = useState([]);
  const [nilaiKategori, setNilaiKategori] = useState('');

  function resetData() {
    const gid = generateid('BRG', 4);
    setTbData({
      id: gid,
      nama: '',
      tag: 'all',
      kategori: nilaiKategori,
      harga: 0,
      stok: 0,
      deskripsi: '',
      status: btStatus[btStatusIdx],
      createdOn: new Date().getTime(),
    });
    setImgDetail([]);
    setIsLoading(false);
  }

  useEffect(() => {
    resetData();
    getListArr();
  }, []);

  const getListArr = () => {
    database()
      .ref('kategori')
      .once('value')
      .then(hasil => {
        let arr = [];
        hasil.forEach(item => {
          arr.push({value: item.key, label: item.val().nama});
        });
        setDtKategori(arr);
        setNilaiKategori(arr[0].value);
      });
  };

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  const updateStatusIdx = i => {
    setBtStatusIdx(i);
    updateTbData('status', btStatus[i]);
  };

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
    setTProses('Start Proses Upload Data...');
    setIsLoading(true);
    setDb();
  }

  async function prosesArr() {
    let hitung = 0;
    for (const item of imgDetail) {
      try {
        const tref = `/produk/${tbData.id}/detail${hitung}.jpg`;
        setTProses(prev => prev + `\n ${tref} ....`);
        await storage().ref(tref).putFile(item.uri);
        setTProses(prev => prev + 'SUKSES');
        hitung++;
      } catch (error) {
        Alert.alert('ERROR', error.message);
        setIsLoading(false);
      }
    }
    setDb();
    //resetData();
  }

  function setDb() {
    setTProses(prev => prev + '\nMenyimpan ke database...');
    database()
      .ref('/produk/' + tbData.id)
      .set({...tbData, kategori: nilaiKategori})
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
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled>
        <View style={styles.container}>
          <Input label="Produk ID" value={tbData.id} disabled />
          <Dropdown
            label="Kategori"
            nilai={nilaiKategori}
            setNilai={setNilaiKategori}
            dtArray={dtKategori}
          />
          <Input
            label="Nama"
            value={tbData.nama}
            onChangeText={text => updateTbData('nama', text)}
          />
          <Input
            label="Tag Pencarian"
            value={tbData.tag}
            onChangeText={text => updateTbData('tag', text)}
          />

          <Input
            label="Harga"
            value={'' + tbData.harga}
            onChangeText={text => updateTbData('harga', Number(text))}
          />
          <Input
            label="Stok"
            value={'' + tbData.stok}
            onChangeText={text => updateTbData('stok', Number(text))}
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
          <Input label="Status" value={tbData.status} disabled={true} />
          <ButtonGroup
            onPress={i => updateStatusIdx(i)}
            selectedIndex={btStatusIdx}
            buttons={btStatus}
            containerStyle={{height: 30, marginBottom: 20}}
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

export default ProdukAdd;
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
  dropdown: {
    padding: 15,
    marginBottom: 10,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 0.7,
  },
  ddLabel: {fontWeight: 'bold', color: 'gray'},
  ddVal: {fontStyle: 'italic', fontSize: 18},
  ddkotakList: {
    width: 200,
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.7,
  },
});
