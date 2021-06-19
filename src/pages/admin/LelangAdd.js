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
import {generateid} from '../../fungsi/Fungsi';
import DateTimePicker from '@react-native-community/datetimepicker';
import noImage from '../../assets/noImage.jpg';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import AmbilFoto from '../../komponen/AmbilFoto';

const lebar = 800;
const tinggi = Math.floor(lebar * 1.3);
const buttonStatus = ['akan', 'sedang', 'selesai'];
let btIndex = 0;

const LelangAdd = () => {
  const [tbData, setTbData] = useState({});
  const [showDateTime, setShowDateTime] = useState(false);
  const [mode, setMode] = useState('date');
  const [durasi, setDurasi] = useState(24);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');

  React.useEffect(() => {
    resetData();
    setIsLoading(false);
  }, []);

  function resetData() {
    const gid = generateid('LL', 4);
    const mulai = moment();
    const selesai = moment(mulai).add(durasi, 'hours');
    const initDt = {
      id: gid,
      mulai: mulai,
      selesai: selesai,
      status: buttonStatus[btIndex],
    };
    setTbData(initDt);
    setImgDetail([]);
  }

  function updateTbData(key, val) {
    setTbData(prev => ({...prev, [key]: val}));
  }

  function setTgl() {
    setMode('date');
    setShowDateTime(true);
  }
  function setJam() {
    setMode('time');
    setShowDateTime(true);
  }

  React.useEffect(() => {
    const selesai = moment(tbData.mulai).add(durasi, 'hours');
    updateTbData('selesai', selesai);
  }, [durasi]);

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

  const updateButtonStatus = i => {
    btIndex = i;
    updateTbData('status', buttonStatus[i]);
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

    if (imgDetail.length === 0) {
      Alert.alert('PERHATIAN', 'minimal upload 1 Foto Detail!');
      return;
    }
    setTProses('Start Proses Upload Images...');
    setIsLoading(true);
    setDb();
  }

  async function prosesArr() {
    let hitung = 0;
    for (const item of imgDetail) {
      try {
        const tref = `produk/${tbData.id}/detail${hitung}.jpg`;
        setTProses(prev => prev + `\n detail${hitung}.jpg ....`);
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
      .ref('/lelang/' + tbData.id)
      .set({
        nama: tbData.nama,
        jenis: tbData.jenis,
        ytb: tbData.ytb,
        openBid: Number(tbData.openBid),
        lastBid: Number(tbData.openBid),
        kelipatan: Number(tbData.kelipatan),
        mulai: moment(tbData.mulai).toISOString(),
        selesai: moment(tbData.selesai).toISOString(),
        status: tbData.status,
        deskripsi: tbData.deskripsi,
        updateOn: new Date().getTime(),
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
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Input label="ID Lelang" value={tbData.id} disabled />
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
            label="Link Youtube"
            value={tbData.ytb}
            onChangeText={text => updateTbData('ytb', text)}
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
          <Text style={styles.label}>Status: {tbData.status}</Text>
          <ButtonGroup
            onPress={i => updateButtonStatus(i)}
            selectedIndex={btIndex}
            buttons={buttonStatus}
            containerStyle={{height: 30, marginBottom: 20}}
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
            onPress={menyimpan}
            buttonStyle={{backgroundColor: Konstanta.warna.satu}}
            containerStyle={{marginVertical: 50}}
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
    </>
  );
};

export default LelangAdd;

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
