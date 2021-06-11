import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {Icon, FAB} from 'react-native-elements';
import CardList from '../../komponen/CardList';
import {ribuan} from '../../fungsi/Fungsi';
import Konstanta from '../../fungsi/Konstanta';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import noImage from '../../assets/noImage.jpg';
import Loading from '../../komponen/Loading';

const KoiTabel = ({navigation}) => {
  const [tbData, setTbData] = useState([]);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTbData([]);
    getDt(true);
  }, []);

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    return () => {
      isMount = false;
    };
  }, []);

  function getDt(mm) {
    const dbRef = database().ref('/produkSatuan');
    dbRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(async res => {
          const tref = 'produk/' + res.key + '/detail0.jpg';
          try {
            const url = await storage().ref(tref).getDownloadURL();
            const inDt = {...res.val(), id: res.key, src: url};
            if (mm) setTbData(prev => [...prev, inDt]);
          } catch (error) {
            console.log(error);
          }
        });
      }
      setIsLoading(false);
      setRefreshing(false);
    });
  }

  // async function prosesArray(arr) {
  //   let hitung = arr.length;
  //   while (hitung > 0) {
  //     hitung = hitung - 1;
  //     let tmp = arr[hitung];
  //     try {
  //       const tref = 'produk/' + tmp.id + '/detail0.jpg';
  //       const url = await storage().ref(tref).getDownloadURL();
  //       tmp.src = {uri: url};
  //       arr[hitung] = tmp;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   setTbData(arr);
  //   setRefreshToken(new Date().getTime());
  //   setIsLoading(false);
  // }

  function menghapus(nama, id) {
    Alert.alert('PERHATIAN', 'Yakin akan hapus ' + nama, [
      {
        text: 'CANCEL',
      },
      {
        text: 'OK',
        onPress: () => {
          const hapusRef = database().ref(`/produkSatuan/${id}`);
          hapusRef.set(null).then(() => hapusStorage(id));
        },
      },
    ]);
  }

  async function hapusStorage(id) {
    const hapusStorageRef = storage().ref().child(`produk/${id}`);
    hapusStorageRef.listAll().then(listHasil => {
      const promises = listHasil.items.map(item => item.delete());
      Promise.all(promises);
    });
  }

  const renderItem = ({item}) => {
    return (
      <Item
        data={item}
        onEdit={() => navigation.navigate('KoiEdit', {produkID: item.id})}
        onHapus={() => menghapus(item.nama, item.id)}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={tbData}
        extraData={refreshToken}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FAB
        title="+"
        color="blue"
        placement="left"
        onPress={() => navigation.navigate('KoiAdd')}
      />
      {isLoading && <Loading />}
    </View>
  );
};

export default KoiTabel;

const Item = ({data, onEdit, onHapus}) => {
  return (
    <CardList>
      <Text selectable style={styles.nama}>
        {data.nama}
      </Text>
      <View style={[styles.tr, {marginVertical: 10}]}>
        <View style={styles.imgWrap}>
          <Image
            source={data.src ? {uri: data.src} : noImage}
            style={{width: 110, height: 110}}
          />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>ID</Text>
            <Text selectable style={styles.tValue}>
              {data.id}
            </Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>Jenis</Text>
            <Text selectable style={styles.tValue}>
              {data.jenis}
            </Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>Harga</Text>
            <Text selectable style={styles.tValue}>
              {ribuan(data.harga)}
            </Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>Link Youtube</Text>
            <Text selectable style={styles.tValue}>
              {data.linkYoutube ? 'ADA' : 'TIDAK ADA'}
            </Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>Status</Text>
            <Text style={styles.tValue}>{data.status}</Text>
          </View>
          <View style={styles.tr}>
            <Text style={styles.tLabel}>Tampil</Text>
            <Text style={styles.tValue}>{data.tampil ? 'YA' : 'TIDAK'}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'flex-end'}}>
          <Icon
            name="pencil"
            type="font-awesome"
            color="green"
            raised
            reverse
            size={16}
            onPress={onEdit}
          />
          <Icon
            name="trash"
            type="font-awesome"
            color="red"
            raised
            reverse
            size={16}
            onPress={onHapus}
          />
        </View>
      </View>
    </CardList>
  );
};

const styles = StyleSheet.create({
  container: {padding: 10, flex: 1},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  nama: {color: Konstanta.warna.satu, fontWeight: 'bold'},
  imgWrap: {padding: 5, marginRight: 10, backgroundColor: 'gray'},
  tr: {flexDirection: 'row'},
  tLabel: {width: 80, color: 'gray', fontWeight: 'bold'},
  tValue: {flex: 1, fontStyle: 'italic'},
});
