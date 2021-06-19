import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  Input,
  ButtonGroup,
  BottomSheet,
  ListItem,
  Button,
  CheckBox,
} from 'react-native-elements';
import noImage from '../../assets/noImage.jpg';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import AmbilFoto from '../../komponen/AmbilFoto';

const lebar = 800;
const tinggi = Math.floor(lebar * 1.3);

const status = ['ready', 'habis'];
const proses = ['proses', 'kirim', 'selesai', 'batal'];

const KoiEdit = ({navigation, route}) => {
  const produkID = route.params.produkID;

  const [tbData, setTbData] = useState({});
  const [statusIndex, setStatusIndex] = useState(0);
  const [prosesIndex, setProsesIndex] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');

  const dbRef = database().ref('/produkSatuan/' + produkID);

  React.useEffect(() => {
    getData();
    listFilesAndDirectories(storage().ref('produk/' + produkID)).then(() => {
      console.log('selesai');
    });
  }, []);

  function listFilesAndDirectories(rfc, pageToken) {
    return rfc.list({pageToken}).then(result => {
      setImgDetail([]);
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
        console.log(url);
        setImgDetail(prev => [...prev, {uri: url}]);
      })
      .catch(e => {
        console.log(e);
      });
  }

  function getData() {
    dbRef.once('value').then(snapshot => {
      const hasil = snapshot.val();
      setTbData({
        ...hasil,
        harga: hasil.harga.toString(),
        id: snapshot.key,
      });
      updateStatus(hasil.status);
      updateProses(hasil.proses);
    });
  }

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  const updateStatus = x => {
    switch (x) {
      case 'ready':
        setStatusIndex(0);
        break;
      case 'habis':
        setStatusIndex(1);
        break;
    }
  };

  const updateProses = x => {
    switch (x) {
      case 'proses':
        setProsesIndex(0);
        break;
      case 'kirim':
        setProsesIndex(1);
        break;
      case 'selesai':
        setProsesIndex(2);
        break;
      case 'batal':
        setProsesIndex(3);
        break;
    }
  };

  const updateIndexStatus = i => {
    setStatusIndex(i);
    updateTbData('status', status[i]);
  };

  const updateIndexProses = i => {
    setProsesIndex(i);
    updateTbData('proses', proses[i]);
  };

  function menyimpan() {
    if (!tbData.nama) {
      Alert.alert('PERHATIAN', 'Nama harus diisi');
      return;
    }

    if (!tbData.harga) {
      Alert.alert('PERHATIAN', 'HARGA harus diisi');
      return;
    }
    setTProses('Start update data...');
    setIsLoading(true);
    setDb();
  }

  function setDb() {
    dbRef
      .update({
        nama: tbData.nama,
        jenis: tbData.jenis,
        harga: Number(tbData.harga),
        linkYoutube: tbData.linkYoutube,
        deskripsi: tbData.deskripsi,
        proses: tbData.proses,
        status: tbData.status,
        tampil: tbData.tampil,
        updateDate: new Date().getTime(),
      })
      .then(() => {
        setTProses(prev => prev + 'SUKSES');
        Alert.alert(
          'SUKSES',
          'Sukses Update Data',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLoading(false);
                navigation.goBack();
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(e => {
        Alert.alert('ERROR', e.message);
        setIsLoading(false);
      });
  }

  return (
    <SafeAreaView>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AmbilFoto
            imgDetail={imgDetail}
            setImgDetail={setImgDetail}
            setIsLoading={setIsLoading}
            produkID={tbData.id}
            onEdit={true}
          />
          <Input label="ID Produk" value={tbData.id} disabled />
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
            keyboardType="number-pad"
            value={tbData.harga}
            onChangeText={text => updateTbData('harga', text)}
          />
          <Input
            label="Link Youtube"
            value={tbData.linkYoutube}
            onChangeText={text => updateTbData('linkYoutube', text)}
          />

          <Text style={styles.label}>Status: {tbData.status}</Text>
          <ButtonGroup
            onPress={i => updateIndexStatus(i)}
            selectedIndex={statusIndex}
            buttons={status}
            textStyle={{textTransform: 'capitalize'}}
            containerStyle={{height: 30, marginBottom: 20}}
          />

          <Text style={styles.label}>Proses: {tbData.proses} </Text>
          <ButtonGroup
            onPress={i => updateIndexProses(i)}
            selectedIndex={prosesIndex}
            buttons={proses}
            textStyle={{textTransform: 'capitalize'}}
            containerStyle={{height: 30, marginBottom: 20}}
          />

          <Text style={styles.label}>
            Tampil: {tbData.tampil ? 'YA' : 'TIDAK'}
          </Text>
          <CheckBox
            title="Tampilkan"
            checked={tbData.tampil}
            onIconPress={() => updateTbData('tampil', !tbData.tampil)}
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

          <Button
            title="UPDATE"
            onPress={menyimpan}
            buttonStyle={{backgroundColor: Konstanta.warna.satu}}
            containerStyle={{marginBottom: 50}}
          />
        </View>
      </ScrollView>
      {isLoading && <Loading keterangan={tProses} />}
    </SafeAreaView>
  );
};

export default KoiEdit;

const styles = StyleSheet.create({
  container: {padding: 20},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
  label: {marginLeft: 15, fontWeight: 'bold', color: 'gray'},
  kotak: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
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
