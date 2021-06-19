import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import {AuthContext} from './AuthProvider';
import imgKosong from '../../assets/empty1.jpg';
import {imgNoData} from '../../assets/addNotes.png';
import {lebar} from '../../fungsi/Dimensi';
import moment from 'moment';

const sekarang = moment();

const Mybid = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const userID = user.uid;
  const [tbData, setTbData] = useState([]);
  useEffect(() => {
    getDt();
  }, []);

  function getDt() {
    const ref = database().ref('lelang');
    ref
      .orderByChild(`peserta/${userID}/userID`)
      .equalTo(userID)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          let arr = [];
          snapshot.forEach(v => {
            const pp = v.val().peserta;
            const arrPeserta = Object.values(pp);
            arrPeserta.sort(function (a, b) {
              return b.bid - a.bid;
            });
            arr.push({...v.val(), id: v.key, peserta: arrPeserta});
          });
          console.log(arr);
          // arr.sort(function (a, b) {
          //   return a.bid - b.bid;
          // });
          setTbData(arr);
        }
      });
  }

  // useEffect(() => {
  //   tbData.map((v, i) => {
  //     const objPeserta = v.peserta;
  //     const arrPeserta = Object.values.objPeserta;
  //     console.log();
  //   });
  // }, [tbData]);

  const renderItem = ({item}) => (
    <Item
      nilai={item}
      userID={userID}
      onPress={() =>
        item.status === 'sedang'
          ? navigation.navigate('LelangDetail', {lelangID: item.id})
          : null
      }
    />
  );

  return (
    <View style={{flex: 1}}>
      {tbData.length > 0 ? (
        <FlatList
          data={tbData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : (
        <NoData />
      )}
    </View>
  );
};

export default Mybid;

const styles = StyleSheet.create({
  tengah: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Item = ({nilai, userID, onPress}) => (
  <View
    style={{
      margin: 10,
      padding: 5,
      borderRadius: 10,
      backgroundColor: 'white',
    }}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 0.6,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
      }}>
      <Text>Lelang ID: {nilai.id}</Text>
      <Text>Nama Lelang: {nilai.nama}</Text>
      {nilai.status === 'sedang' && (
        <Text style={{color: 'green'}}>Sedang Berlangsung</Text>
      )}
      <Text>Peserta:</Text>
      <View style={{paddingLeft: 10}}>
        {nilai.peserta.map((dt, i) => {
          return (
            <View
              key={i}
              style={[
                {flexDirection: 'row', paddingHorizontal: 5},
                dt.userID === userID ? {backgroundColor: 'mistyrose'} : null,
              ]}>
              <Text style={{width: 30}}>{i + 1}</Text>
              <Text style={{flex: 1}}>{dt.nama}</Text>
              <Text>{dt.bid}</Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  </View>
);

const NoData = () => (
  <View style={styles.tengah}>
    <Image
      source={imgKosong}
      style={{width: lebar * 0.7, height: lebar * 0.7, resizeMode: 'contain'}}
    />
    <Text style={{color: 'orangered', marginBottom: 10}}>
      Anda belum mengikuti lelang
    </Text>
  </View>
);
