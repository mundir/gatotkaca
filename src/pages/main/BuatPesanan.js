import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import {Card, Input} from 'react-native-elements';
import Headerku from '../../komponen/Headerku';
import Konstanta from '../../fungsi/Konstanta';
import {ribuan} from '../../fungsi/Fungsi';
import {AuthContext} from './AuthProvider';
import database from '@react-native-firebase/database';

const BuatPesanan = ({navigation}) => {
  const {user} = React.useContext(AuthContext);
  const {displayName, phoneNumber, alamat} = user;
  const initUSer = {displayName, phoneNumber, alamat};
  const [tbData, setTbData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalAlamat, setModalAlamat] = useState(false);
  const [userTampil, setUserTampil] = useState(initUSer);
  const [userEdit, setUserEdit] = useState(initUSer);
  const [info, setInfo] = useState('');

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    getDtInfo(isMount);
    return () => {
      isMount = false;
    };
  }, []);

  function getDt(isMount) {
    database()
      .ref('/keranjang/' + user.uid)
      .orderByChild('isDibeli')
      .equalTo(true)
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            let arr = [];
            let tharga = 0;
            snapshot.forEach((v, i) => {
              const hasil = v.val();
              tharga += hasil.harga * hasil.qty;
              arr.push(hasil);
            });
            setTbData(arr);
            setTotal(tharga);
          }
        }
      });
  }

  function getDtInfo(isMount) {
    database()
      .ref('/setting/infoTransaksi')
      .once('value')
      .then(snapshot => {
        if (isMount) {
          if (snapshot.exists) {
            setInfo(snapshot.val());
          }
        }
      });
  }

  function onEditUser() {
    const dbRef = database().ref('/users/' + user.uid);
    dbRef
      .update(userEdit)
      .then(() => {
        setUserTampil({...userEdit});
      })
      .catch(er => console.log(er));
    setModalAlamat(false);
  }

  function onOke() {
    let newOb = {
      userID: user.uid,
      userNama: user.displayName,
      status: 'proses',
      txDate: new Date().getTime(),
    };
    let produk = {};
    tbData.forEach((v, i) => {
      produk[v.produkID] = {...v};
      hapusKeranjang(v.produkID);
    });
    newOb.produk = produk;
    const newTransaksi = database().ref('/transaksi').push();
    newTransaksi.set(newOb).then(() => navigation.navigate('Transaksi'));
  }

  function hapusKeranjang(produkID) {
    database()
      .ref(`/keranjang/${user.uid}/${produkID}`)
      .set(null)
      .then(() => {
        console.log('barhasil delete row keranjang');
      });
  }

  let hitung = 0;
  return (
    <>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <Card>
            <Card.Title>DAFTAR PESANAN</Card.Title>
            <Card.Divider />
            {tbData.map((v, i) => {
              hitung += 1;
              return (
                <View key={i} style={styles.row}>
                  <View style={{width: 30}}>
                    <Text>{hitung}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text>{v.produkNama}</Text>
                    <View style={styles.row}>
                      <Text>@ {ribuan(v.harga)}</Text>
                      <Text>x{v.qty}</Text>
                      <Text>Rp{ribuan(v.harga * v.qty)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          <Card>
            <Card.Title>DATA PENERIMA</Card.Title>
            <Card.Divider />
            <View style={styles.row2}>
              <Text style={{width: 100}}>Nama</Text>
              <Text style={styles.tVal2}>: {userTampil.displayName}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>HP / WA</Text>
              <Text style={styles.tVal2}>: {userTampil.phoneNumber}</Text>
            </View>
            <View style={styles.row2}>
              <Text style={{width: 100}}>Alamat</Text>
              <Text style={styles.tVal2}>:</Text>
            </View>
            <Text style={styles.tVal}>{userTampil.alamat}</Text>
            <Card.Divider />
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <View style={{width: 130}}>
                <Button title="Edit" onPress={() => setModalAlamat(true)} />
              </View>
            </View>
          </Card>

          <Card>
            <Card.Title>INFO TRANSAKSI</Card.Title>
            <Card.Divider />
            <Text>{info}</Text>
          </Card>
        </ScrollView>

        <View style={styles.contTotal}>
          <View>
            <Text style={styles.contTextA}>Total Harga</Text>
            <Text style={styles.contTextB}>Rp{ribuan(total)}</Text>
          </View>

          <TouchableOpacity style={styles.tombolProses} onPress={onOke}>
            <Text style={styles.textTombol}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalAlamat}
        onRequestClose={() => {
          setModalAlamat(false);
        }}>
        <View style={styles.modal}>
          <View style={styles.cardEdit}>
            <Input
              label="Nama"
              placeholder="Nama..."
              value={userEdit.displayName}
              onChangeText={value =>
                setUserEdit(prev => ({...prev, displayName: value}))
              }
            />
            <Input
              label="HP/ WA"
              placeholder="Nomor HP / WA"
              value={userEdit.phoneNumber}
              onChangeText={value =>
                setUserEdit(prev => ({...prev, phoneNumber: value}))
              }
            />
            <Text>Alamat:</Text>
            <Input
              placeholder="Alamat..."
              numberOfLines={4}
              multiline={true}
              value={userEdit.alamat}
              onChangeText={value =>
                setUserEdit(prev => ({...prev, alamat: value}))
              }
            />

            <Button title="Simpan" onPress={onEditUser} />
          </View>
        </View>
        <Pressable
          onPress={() => {
            setModalAlamat(false);
          }}
          style={styles.modalOut}
        />
      </Modal>
    </>
  );
};

export default BuatPesanan;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  row2: {flexDirection: 'row'},
  contTotal: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contTextA: {color: Konstanta.warna.text, fontSize: 10},
  contTextB: {color: Konstanta.warna.satu, fontSize: 18, fontWeight: 'bold'},
  tombolProses: {
    backgroundColor: Konstanta.warna.satu,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  textTombol: {color: 'white', fontWeight: 'bold'},
  tVal: {marginLeft: 5, fontStyle: 'italic', color: 'gray'},
  tVal2: {fontStyle: 'italic', color: 'gray'},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
});
