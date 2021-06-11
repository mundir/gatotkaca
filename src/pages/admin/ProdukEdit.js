import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
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
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Loading from '../../komponen/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dropdown from '../../komponen/Dropdown';
import AmbilFoto from '../../komponen/AmbilFoto';

const btStatus = ['ready', 'habis', 'off'];

const ProdukEdit = ({navigation, route}) => {
  const produkID = route.params.produkID;

  const initTb = {
    harga: 0,
    stok: 0,
  };

  const [tbData, setTbData] = useState(initTb);
  const [btStatusIdx, setBtStatusIdx] = useState(0);
  const [imgDetail, setImgDetail] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tProses, setTProses] = useState('');

  const dbRef = database().ref('/produk/' + produkID);

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
        ...tbData,
        ...hasil,
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
      case 'ready':
        setBtStatusIdx(0);
        break;
      case 'habis':
        setBtStatusIdx(1);
        break;
      case 'off':
        setBtStatusIdx(2);
        break;
    }
  };

  const updateIndexStatus = i => {
    setBtStatusIdx(i);
    updateTbData('status', btStatus[i]);
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
      .update({...tbData, updatedOn: new Date().getTime()})
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
          <Input label="ID Produk" value={tbData.id} disabled />

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
            label="Harga"
            keyboardType="number-pad"
            value={tbData.harga.toString()}
            onChangeText={text => updateTbData('harga', Number(text))}
          />
          <Input
            label="Stok"
            keyboardType="number-pad"
            value={tbData.stok.toString()}
            onChangeText={text => updateTbData('stok', Number(text))}
          />
          <Input
            label="Tag"
            value={tbData.tag}
            onChangeText={text => updateTbData('tag', text)}
          />
          <Text style={styles.label}>Status: {tbData.status}</Text>
          <ButtonGroup
            onPress={i => updateIndexStatus(i)}
            selectedIndex={btStatusIdx}
            buttons={btStatus}
            textStyle={{textTransform: 'capitalize'}}
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

export default ProdukEdit;

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
