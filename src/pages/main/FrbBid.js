import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import {ButtonGroup} from 'react-native-elements';
import moment from 'moment';
import {AuthContext} from './AuthProvider';
import Konstanta from '../../fungsi/Konstanta';
import Headerku from '../../komponen/Headerku';

const sekarang = moment();

const FrbBid = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const userID = user.uid;
  const [tbDataSaya, setTbDataSaya] = useState([]);
  const [tbDataSedang, setTbDataSedang] = useState([]);
  const [tbDataAkan, setTbDataAkan] = useState([]);
  const [tbDataSelesai, setTbDataSelesai] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshToken, setRefreshToken] = useState(null);
  const refBid = database().ref('/lelang');
  //1.semua data lelang saya
  //2.semua data

  useEffect(() => {
    // getDt();
    const getBid = refBid.orderByChild('updateOn').on('value', snapshot => {
      let llSaya = [];
      let llSedang = [];
      let llAkan = [];
      let llSelesai = [];
      snapshot.forEach(v => {
        const hasil = v.val();
        const key = v.key;
        const peserta = {...hasil.peserta};
        const inData = {...hasil, id: key};
        if (peserta.hasOwnProperty(userID)) {
          llSaya.push(inData);
        }
        if (hasil.status === 'sedang') {
          llSedang.push(inData);
        }
        if (hasil.status === 'akan') {
          llAkan.push(inData);
        }
        if (hasil.status === 'selesai') {
          llSelesai.push(inData);
        }
      });
      setTbDataSaya(llSaya);
      setTbDataSedang(llSedang);
      setTbDataAkan(llAkan);
      setTbDataSelesai(llSelesai);
      setRefreshToken(new Date().getTime());
    });
    return () => {
      refBid.off('value', getBid);
    };
  }, []);

  // function getDt() {
  //   const refdb = database().ref('lelang');
  //   refdb
  //     .orderByChild('peserta/' + userID + '/nama')
  //     .equalTo('Mundir Muzaini Edit')
  //     .once('value')
  //     .then(snapshot => {
  //       console.log(snapshot.val());
  //     });
  // }

  function updateTabIndex(i) {
    setTabIndex(i);
  }

  function prosesPress(id, status) {
    if (status === 'akan') {
      navigation.navigate('LelangDetailAkan', {lelangID: id});
    }
    navigation.navigate('LelangDetail', {lelangID: id});
  }

  const buttons = ['BID SAYA', 'SEDANG', 'AKAN', 'SELESAI'];

  const renderItem = ({item}) => {
    return (
      <Card data={item} onPress={() => prosesPress(item.id, item.status)} />
    );
  };

  return (
    <View>
      {/* <Header centerComponent={{text: 'DATA LELANG', style: {color: '#fff'}}} /> */}
      <Headerku judul="Data Lelang" />
      <ButtonGroup
        onPress={i => updateTabIndex(i)}
        selectedIndex={tabIndex}
        buttons={buttons}
        containerStyle={{height: 40}}
      />
      {tabIndex === 0 && (
        <FlatList
          data={tbDataSaya}
          extraData={refreshToken}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {tabIndex === 1 && (
        <FlatList
          data={tbDataSedang}
          extraData={refreshToken}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {tabIndex === 2 && (
        <FlatList
          data={tbDataAkan}
          extraData={refreshToken}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      {tabIndex === 3 && (
        <FlatList
          data={tbDataSelesai}
          extraData={refreshToken}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default FrbBid;

const Card = ({data, onPress}) => {
  const selesai = moment(data.selesai);
  let status = data.status;
  if (status === 'sedang') {
    if (selesai.isAfter(sekarang)) {
      status = 'Aktif';
    } else {
      status = 'Menunggu konfirmasi';
    }
  }
  return (
    <View key={data.id}>
      <View
        style={[
          styles.card,
          status === 'Aktif' && {backgroundColor: '#ffd4d4'},
        ]}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.judul}>{data.nama}</Text>
          <View style={styles.row}>
            <Text>Bid Tertinggi {data.lastBid}</Text>
            <Text>{data.lastUserNama}</Text>
          </View>
          <View style={styles.row}>
            <Text>Mulai {moment(data.mulai).format('DD/MM/YY')}</Text>
            <Text>Selesai{moment(data.selesai).format('DD/MM/YY')}</Text>
          </View>
          <Text>Status {status}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
  },
  judul: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Konstanta.warna.satu,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
});
