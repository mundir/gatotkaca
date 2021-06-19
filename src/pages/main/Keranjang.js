import React, {useState, useEffect} from 'react';
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import CheckBox from '@react-native-community/checkbox';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import Icon from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import {AuthContext} from './AuthProvider';
import CartEmpty from '../../assets/cartEmpty.jpg';
import {tunggu} from '../../fungsi/Fungsi';
const Keranjang = ({navigation}) => {
  const {user} = React.useContext(AuthContext);

  const [tbData, setTbData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    return () => {
      isMount = false;
    };
  }, []);

  useEffect(() => {
    var x = 0;
    tbData.forEach((value, index) => {
      if (value.isDibeli) {
        x = x + value.harga * value.qty;
      }
    });
    setTotal(x);
  }, [tbData]);

  function getDt(isMount) {
    database()
      .ref('/keranjang/' + user.uid)
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            let arr = [];
            snapshot.forEach((v, i) => {
              arr.push(v.val());
            });
            console.log(arr);
            setTbData(arr);
          }
        }
      });
  }

  function simpanQty(id, qty) {
    database()
      .ref(`/keranjang/${user.uid}/${id}`)
      .update({qty: qty})
      .then(() => {
        console.log('barhasil update qty');
      });
  }

  function updateIsBeli(i, tf) {
    const produkID = tbData[i].produkID;
    let tmp = [...tbData];
    tmp[i].isDibeli = tf;
    database()
      .ref(`/keranjang/${user.uid}/${produkID}`)
      .update({isDibeli: tf})
      .then(() => {
        console.log('barhasil update qty');
        setTbData(tmp);
      });
  }

  function updateQty(i, qty) {
    let tmp = [...tbData];
    tmp[i].qty = qty;
    setTbData(tmp);
  }

  function kurangi(i) {
    const produkID = tbData[i].produkID;
    let qty = tbData[i].qty;

    if (qty > 1) {
      qty -= 1;
      updateQty(i, qty);
      simpanQty(produkID, qty);
    }
  }

  function tambahi(i) {
    const produkID = tbData[i].produkID;
    let qty = tbData[i].qty;
    let stok = tbData[i].stok;
    if (qty < stok) {
      qty += 1;
      updateQty(i, qty);
      simpanQty(produkID, qty);
    } else {
      Alert.alert(
        'anda sudah mencapai pembelian maksimal. Stok produk: ' + stok,
      );
    }
  }

  const handleInputQty = (i, t) => {
    updateQty(i, Number(t));
  };

  const handleOnEnd = (id, e) => {
    simpanQty(id, Number(e.nativeEvent.text));
  };

  const handleHapus = i => {
    const x = tbData[i].produkNama;
    Alert.alert(
      'Hapus',
      'Apakah akan menghapus ' + x + ' dari keranjang?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'HAPUS', onPress: () => hapus(i)},
      ],
      {cancelable: false},
    );
  };

  function hapus(ix) {
    const produkID = tbData[ix].produkID;
    database()
      .ref(`/keranjang/${user.uid}/${produkID}`)
      .set(null)
      .then(() => {
        let tempArr = [...tbData];
        tempArr.splice(ix, 1);
        setTbData(tempArr);
      });
  }

  function prosesBuatPesanan() {
    if (total) {
      navigation.navigate('BuatPesanan');
    } else {
      Alert.alert('PERHATIAN', 'silahkan pilih produk untuk melanjutkan');
    }
  }

  return (
    <>
      {tbData.length > 0 ? (
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {tbData.map((l, i) => {
              // let qty = l.qty.toString();
              return (
                <ListItem key={i} bottomDivider>
                  <CheckBox
                    disabled={false}
                    value={l.isDibeli}
                    onValueChange={v => updateIsBeli(i, v)}
                  />
                  <ListItem.Content>
                    <ListItem.Title
                      style={styles.namaBarang}
                      onPress={() =>
                        navigation.navigate('ProdukDetail', {
                          produkID: l.produkID,
                        })
                      }>
                      {l.produkNama}
                    </ListItem.Title>
                    <View style={styles.boxSub}>
                      <View>
                        <Text style={styles.hargaAsal}>
                          {l.harga} x {l.qty}
                        </Text>
                        <Text style={styles.harga}>
                          Rp{ribuan(l.harga * l.qty)}
                        </Text>
                      </View>
                      <View style={styles.boxQty}>
                        <TouchableOpacity
                          onPress={() => kurangi(i)}
                          style={styles.btnQty}>
                          <Text>-</Text>
                        </TouchableOpacity>
                        <TextInput
                          style={styles.inputQty}
                          value={l.qty.toString()}
                          keyboardType="numeric"
                          onChangeText={text => handleInputQty(i, text)}
                          onEndEditing={e => handleOnEnd(l.produkID, e)}
                        />
                        <TouchableOpacity
                          onPress={() => tambahi(i)}
                          style={styles.btnQty}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ListItem.Content>
                  <ListItem.Chevron
                    name="delete"
                    color="red"
                    size={20}
                    containerStyle={{width: 35, justifyContent: 'center'}}
                    onPress={() => handleHapus(i)}
                  />
                </ListItem>
              );
            })}
          </ScrollView>
          <View style={styles.contTotal}>
            <View>
              <Text style={styles.contTextA}>Total Harga</Text>
              <Text style={styles.contTextB}>Rp{ribuan(total)}</Text>
            </View>

            <TouchableOpacity
              style={styles.tombolProses}
              onPress={prosesBuatPesanan}>
              <Text style={styles.textTombol}>CEK PESANAN</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TidakAdaData />
      )}
    </>
  );
};
export default Keranjang;

const TidakAdaData = () => (
  <View style={styles.cardKosong}>
    <Image
      source={CartEmpty}
      style={{width: 250, height: 250, resizeMode: 'contain'}}
    />
    <Text style={styles.tKosong}>
      ups.. Keranjang masih kosong,{'\n'}Ayo belanja sekarang!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  cardKosong: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tKosong: {color: 'red', textAlign: 'center'},
  contTotal: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contTextA: {color: Konstanta.warna.text, fontSize: 10},
  contTextB: {color: Konstanta.warna.satu, fontSize: 18, fontWeight: 'bold'},
  namaBarang: {fontSize: 14},
  boxSub: {
    width: '100%',
    flexDirection: 'row',
    padding: 2,
    justifyContent: 'space-between',
  },
  hargaAsal: {fontSize: 12, color: Konstanta.warna.disabled},
  harga: {fontSize: 14, color: Konstanta.warna.satu},
  boxQty: {
    flexDirection: 'row',
    width: 110,
    height: 30,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  btnQty: {
    height: 30,
    width: 30,
    color: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputQty: {
    width: 40,
    height: 30,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'grey',
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
  },
  tmaxbeli: {fontSize: 12, color: 'red', fontStyle: 'italic'},
  tengah: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Konstanta.warna.satu,
  },
  hapus: {
    flexDirection: 'row',
    width: 30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Konstanta.warna.satu,
  },
  tombolProses: {
    backgroundColor: Konstanta.warna.satu,
    padding: 8,
    borderRadius: 5,
  },
  textTombol: {color: 'white', fontWeight: 'bold'},
  isLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
