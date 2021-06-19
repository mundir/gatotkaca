import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Alert,
  Text,
  Image,
  View,
  FlatList,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import {FAB} from 'react-native-elements';
import ItemProduk from '../../komponen/ItemProduk';
import database from '@react-native-firebase/database';
import {SearchBar} from 'react-native-elements';
import Konstanta from '../../fungsi/Konstanta';
import {AuthContext} from './AuthProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import noData from '../../assets/noData.png';

const numColumns = 2;

const formatData = dataList => {
  const totalRows = Math.floor(dataList.length / numColumns);
  let totalLastRow = dataList.length - totalRows * numColumns;

  while (totalLastRow !== 0 && totalLastRow !== numColumns) {
    dataList.push({id: 'kosong', empty: true});
    totalLastRow++;
  }
  return dataList;
};

const Produk = ({navigation, route}) => {
  const {user} = React.useContext(AuthContext);

  const kategori = route.params.kategori;
  const [tbData, setTbData] = useState([]);
  const [tbTampil, setTbTampil] = useState([]);
  const [cari, setCari] = useState();
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    getTbData();
  }, []);

  function getTbData() {
    database()
      .ref('/produk')
      .orderByChild('kategori')
      .equalTo(kategori)
      .once('value')
      .then(snapshot => {
        let newArr = [];
        snapshot.forEach(x => newArr.push({...x.val(), id: x.key}));
        setTbData(newArr);
        setTbTampil(newArr);
        setRefreshToken(new Date().getTime());
      });
  }

  function mencari() {
    const tmp = [...tbData];
    const hasilFilter = tmp.filter(v => {
      let nama = v.nama ? v.nama.toLowerCase() : '';
      return nama.includes(cari.toLowerCase());
    });
    setTbTampil(hasilFilter);
    setRefreshToken(new Date().getTime());
  }

  function resetCari() {
    setCari('');
    const tmp = [...tbData];
    setTbTampil(tmp);
    setRefreshToken(new Date().getTime());
  }

  function membeli(item) {
    let stok = item.stok;
    console.log(stok);
    let inDt = {
      produkID: item.id,
      produkNama: item.nama,
      harga: item.harga,
      stok: stok,
      qty: 1,
      isDibeli: false,
    };
    const ref = database().ref(`/keranjang/${user.uid}/${item.id}`);
    ref.once('value').then(snapshot => {
      if (snapshot.exists()) {
        let qty = snapshot.val().qty;
        if (qty < stok) {
          inDt.qty = qty + 1;
          ref.set(inDt).then(() => {
            ToastAndroid.showWithGravity(
              `Menambahkan ${item.nama} kedalam keranjang. Total Qty: ${inDt.qty}`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          });
        } else {
          Alert.alert(
            'Perhatian',
            'Anda sudah mencapai pembelian maksimal.\nQty keranjang: ' + qty,
          );
        }
      } else {
        ref.set(inDt).then(() => {
          ToastAndroid.showWithGravity(
            `Menambahkan ${item.nama} kedalam keranjang. Total Qty: ${inDt.qty}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        });
      }
    });
  }

  const renderItem = ({item}) => {
    return (
      <ItemProduk
        datas={item}
        onDetail={() =>
          navigation.navigate('ProdukDetail', {
            produkID: item.id,
          })
        }
        onBeli={() => membeli(item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="cari Nama atau Jenis"
        onChangeText={text => setCari(text)}
        value={cari}
        platform="android"
        onClear={resetCari}
        onSubmitEditing={mencari}
      />
      {tbTampil.length > 0 ? (
        <View style={styles.containerList}>
          <FlatList
            data={formatData(tbTampil)}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            // extraData={refreshToken}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={noData} width={200} height={200} />
          <Text style={{color: 'red'}}>
            Maaf, data yang anda cari tidak ditemukan
          </Text>
        </View>
      )}

      <FAB
        title={<Icon name="shopping-bag" size={18} color="white" />}
        placement="right"
        color={Konstanta.warna.satu}
        onPress={() => navigation.navigate('Keranjang')}
      />
    </SafeAreaView>
  );
};

export default Produk;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerList: {padding: 5, flex: 1},
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
