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
} from 'react-native';
import {
  Input,
  ButtonGroup,
  BottomSheet,
  ListItem,
  Button,
} from 'react-native-elements';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import noImage from '../../assets/noImage.jpg';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import AmbilFoto from '../../komponen/AmbilFoto';

const lebar = 800;
const tinggi = Math.floor(lebar * 1.3);

const status = ['sedang', 'akan', 'selesai'];

const LelangEdit = ({navigation, route}) => {
  const lelangID = route.params.lelangID;

  const [tbData, setTbData] = useState({});
  const [showDateTime, setShowDateTime] = useState(false);
  const [mode, setMode] = useState('date');
  const [statusIndex, setStatusIndex] = useState(0);
  const [durasi, setDurasi] = useState(24);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');

  const dbRef = database().ref('/lelang/' + lelangID);

  React.useEffect(() => {
    getData();
    listFilesAndDirectories(storage().ref('produk/' + lelangID)).then(() => {
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
      console.log(hasil);
      setTbData({
        ...hasil,
        openBid: hasil.openBid.toString(),
        kelipatan: hasil.kelipatan.toString(),
        id: snapshot.key,
      });
      updateStatus(hasil.status);
    });
  }

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  const updateStatus = x => {
    switch (x) {
      case 'sedang':
        setStatusIndex(0);
        break;
      case 'akan':
        setStatusIndex(1);
        break;
      case 'selesai':
        setStatusIndex(2);
        break;
    }
  };

  const updateIndexStatus = i => {
    setStatusIndex(i);
    updateTbData('status', status[i]);
  };

  function setTgl() {
    setMode('date');
    setShowDateTime(true);
  }
  function setJam() {
    setMode('time');
    setShowDateTime(true);
  }

  React.useEffect(() => {
    const mulai = tbData.mulai;
    const selesai = moment(mulai).add(durasi, 'hours');

    updateTbData('selesai', selesai);
  }, [durasi]);

  // React.useEffect(() => {
  //   setShowDateTime(true);
  // }, [mode]);

  const onChange = (event, selectedDate) => {
    try {
      if (event.type === 'set') {
        const mulai = selectedDate || tbData.mulai;
        const selesai = moment(mulai).add(durasi, 'hours');

        updateTbData('mulai', mulai);
        updateTbData('selesai', selesai);
      }
      setShowDateTime(false);
    } catch (error) {
      console.log(error);
    }
  };

  function menyimpan() {
    if (!tbData.nama) {
      Alert.alert('PERHATIAN', 'Nama harus diisi');
      return;
    }

    if (!tbData.openBid) {
      Alert.alert('PERHATIAN', 'OpenBid harus diisi');
      return;
    }
    if (!tbData.kelipatan) {
      Alert.alert('PERHATIAN', 'kelipatan harus diisi');
      return;
    }

    setTProses('Start update data...');
    setIsLoading(true);
    setDb();
  }

  function setDb() {
    setTProses(prev => prev + '\nMenyimpan ke database...');
    database()
      .ref('/lelang/' + tbData.id)
      .update({
        nama: tbData.nama,
        jenis: tbData.jenis,
        openBid: Number(tbData.openBid),
        lastBid: Number(tbData.openBid),
        kelipatan: Number(tbData.kelipatan),
        mulai: moment(tbData.mulai).toISOString(),
        selesai: moment(tbData.selesai).toISOString(),
        status: tbData.status,
      })
      .then(() => {
        setTProses(prev => prev + 'SUKSES');
        Alert.alert('SUKSES', 'Sukses Update Data');
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(e => {
        Alert.alert('ERROR', e.message);
        setIsLoading(false);
      });
  }
  // return (
  //   <View>
  //     <Text>percobaan</Text>
  //   </View>
  // );

  return (
    <View>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Input label="ID Lelang" value={tbData.id} disabled />
          <AmbilFoto
            imgDetail={imgDetail}
            setImgDetail={setImgDetail}
            setIsLoading={setIsLoading}
            produkID={tbData.id}
            onEdit={true}
          />
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
            label="OpenBid"
            keyboardType="number-pad"
            value={tbData.openBid}
            onChangeText={text => updateTbData('openBid', text)}
          />
          <Input
            label="Kelipatan"
            keyboardType="number-pad"
            value={tbData.kelipatan}
            onChangeText={text => updateTbData('kelipatan', text)}
          />

          <View style={[styles.row, {justifyContent: 'flex-end'}]}>
            <Pressable style={styles.set} onPress={setTgl}>
              <Text style={styles.tset}>set Tanggal</Text>
            </Pressable>
            <Pressable style={styles.set} onPress={setJam}>
              <Text style={styles.tset}>set Jam</Text>
            </Pressable>
          </View>
          <Input
            label="mulai"
            value={moment(tbData.mulai).format('DD/MM/YYYY HH:mm')}
            disabled={true}
          />

          <Input
            label="Durasi (Jam)"
            keyboardType="number-pad"
            value={durasi.toString()}
            onChangeText={text => setDurasi(Number(text))}
          />
          <Input
            label="selesai"
            value={moment(tbData.selesai).format('DD/MM/YYYY HH:mm')}
            disabled={true}
          />
          <Text style={styles.label}>Status</Text>
          <ButtonGroup
            onPress={i => updateIndexStatus(i)}
            selectedIndex={statusIndex}
            buttons={status}
            containerStyle={{height: 30, marginBottom: 20}}
          />
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={tbData.deskripsi}
            onChangeText={text => updateTbData('deskripsi', text)}
            textAlignVertical="top"
          />
          {/* <Text style={styles.label}>
            Upload Foto Profil (ukuran persegi 1 : 1)
          </Text>
          <TouchableOpacity onPress={getImgProfil} style={styles.kotak}>
            <Image source={img ? img : noImage} style={styles.image} />
          </TouchableOpacity> */}

          <Button
            title="Simpan"
            onPress={menyimpan}
            buttonStyle={{backgroundColor: Konstanta.warna.satu}}
            containerStyle={{marginBottom: 50}}
          />
        </View>
      </ScrollView>
      {showDateTime && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(tbData.mulai)}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      {isLoading && <Loading keterangan={tProses} />}
    </View>
  );
};

export default LelangEdit;

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
});
