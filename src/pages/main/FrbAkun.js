/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  Input,
  Button,
  BottomSheet,
  ListItem,
  ButtonGroup,
  Overlay,
} from 'react-native-elements';
import {AuthContext} from './AuthProvider';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import noImage from '../../assets/noImage.jpg';
import Konstanta from '../../fungsi/Konstanta';

// const lebar = Dimensions.get('window').width;
const lebar = 400;
const tinggi = Math.floor(lebar * 1.3);

const FrbAkun = ({navigation}) => {
  const {user, setUser, logout} = React.useContext(AuthContext);
  const [dtUser, setDtUser] = useState({
    displayName: '',
    alamat: '',
    phoneNumber: '',
    email: '',
  });
  const [foto, setFoto] = useState(null);
  const [showBottom, setShowBottom] = useState(false);
  const [modalAlamat, setModalAlamat] = useState(false);
  const [btnIndex, setBtnIndex] = useState(0);
  const [tampilOverlay, setTampilOverlay] = useState(false);
  const [dtOngkir, setDtOngkir] = useState([]);
  const [dtOngkirTampil, setDtOngkirTampil] = useState([]);

  useEffect(() => {
    getUser();
    getOngkir();
  }, []);

  function getUser() {
    const dbRef = database().ref('/users/' + user.uid);
    dbRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        setDtUser(snapshot.val());
        snapshot.val().photoURL
          ? setFoto({uri: snapshot.val().photoURL})
          : null;
      }
    });
  }

  function getOngkir() {
    const dbRef = database().ref('/ongkirKoi');
    dbRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        const arr = [];
        snapshot.forEach(v => {
          arr.push(v.val());
        });
        setDtOngkir(arr);
      }
    });
  }

  function updateUser(inDt) {
    const dbRef = database().ref('/users/' + user.uid);
    dbRef
      .update(inDt)
      .then(() => {
        console.log('user updated');
      })
      .catch(er => console.log(er));
  }

  function onSimpan() {
    setModalAlamat(false);
    updateUser(dtUser);
    setUser(prev => ({...prev, ...dtUser}));
  }

  function ambilKamera() {
    setShowBottom(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: lebar,
        maxHeight: tinggi,
      },
      hasil => {
        if (!hasil.didCancel) {
          setFoto({uri: hasil.uri});
          uploadFoto(hasil);
        }
      },
    );
  }

  function ambilGalery() {
    setShowBottom(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: lebar,
        maxHeight: tinggi,
      },
      hasil => {
        if (!hasil.didCancel) {
          setFoto({uri: hasil.uri});
          uploadFoto(hasil);
        }
      },
    );
  }

  async function uploadFoto(hasil) {
    const refImg = storage().ref('users/' + user.uid + '.jpg');
    try {
      await refImg.putFile(hasil.uri);
    } catch (error) {
      console.log(error);
    }
    const url = await refImg.getDownloadURL();
    console.log(url);
    updateUser({photoURL: url});
  }

  function editUser() {
    setShowBottom(false);
    setModalAlamat(true);
  }

  function handleKota() {
    setTampilOverlay(true);
    const tmp = [...dtOngkir];
    setDtOngkirTampil(tmp);
  }

  function cariKota(t) {
    const tmp = [...dtOngkir];
    const hasilFilter = tmp.filter(v => {
      let kota = v.kota ? v.kota.toLowerCase() : '';
      return kota.includes(t.toLowerCase());
    });
    setDtOngkirTampil(hasilFilter);
  }

  function pressKota(kota, harga) {
    setDtUser(prev => ({
      ...prev,
      kota: kota,
      ongkir: harga,
    }));
    // updateUser({kota: kota, ongkir: harga});
    setTampilOverlay(false);
  }

  const bottomListAdmin = [
    {
      title: 'Admin - Data Lelang',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('LelangTabel');
      },
    },
    {
      title: 'Admin - Data Koi',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('KoiTabel');
      },
    },
    {
      title: 'Admin - Data Produk',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('ProdukTabel');
      },
    },
    {
      title: 'Admin - Ongkir',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('AdminOngkir');
      },
    },
    {
      title: 'Admin - Jenis Koi',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('JenisKoi');
      },
    },
    {
      title: 'Admin - Setting',
      onPress: () => {
        setShowBottom(false);
        navigation.navigate('Setting');
      },
    },
  ];

  const bottomList = [
    {title: 'Ambil Foto Kamera', onPress: ambilKamera},
    {title: 'Ambil Foto Galeri', onPress: ambilGalery},
    {title: 'Edit Data User', onPress: editUser},
    // {
    //   title: 'Edit Data Kota',
    //   onPress: () => {
    //     setShowBottom(false);
    //     setTampilOverlay(true);
    //     const tmp = [...dtOngkir];
    //     setDtOngkirTampil(tmp);
    //   },
    // },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setShowBottom(false),
    },
  ];

  const arrList = user.isAdmin
    ? bottomListAdmin.concat(bottomList)
    : bottomList;

  return (
    <>
      <View style={styles.container}>
        <Image source={foto ? foto : noImage} style={styles.img} />
        <Text style={styles.nama}>{dtUser.displayName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{dtUser.email}</Text>
        <Text style={styles.label}>HP / WA</Text>
        {dtUser.phoneNumber ? (
          <Text style={styles.value}>{dtUser.phoneNumber}</Text>
        ) : (
          <Text style={styles.valueErr}>Belum diatur!</Text>
        )}
        <Text style={styles.label}>Alamat:</Text>
        {dtUser.alamat ? (
          <Text style={styles.value} multiline={true} numberOfLines={4}>
            {dtUser.alamat}
          </Text>
        ) : (
          <Text style={styles.valueErr}>Belum diatur!</Text>
        )}
        <Text style={styles.label}>Kabupaten / Kota</Text>
        {dtUser.kota ? (
          <Text style={styles.value}>{dtUser.kota}</Text>
        ) : (
          <Text style={styles.valueErr}>Belum diatur!</Text>
        )}

        <Button
          title="Edit"
          type="outline"
          buttonStyle={styles.btn}
          onPress={() => setShowBottom(true)}
        />

        <View
          style={{
            width: '90%',
            height: 0.5,
            backgroundColor: 'gray',
            marginBottom: 15,
          }}
        />
        <Button
          title="LOGOUT"
          type="clear"
          buttonStyle={[styles.btn, {borderColor: 'red', borderWidth: 1}]}
          titleStyle={{color: 'red'}}
          onPress={() => logout()}
        />
      </View>
      <BottomSheet isVisible={showBottom} containerStyle={styles.bottom}>
        {arrList.map((l, i) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
      <Overlay
        isVisible={tampilOverlay}
        onBackdropPress={() => setTampilOverlay(false)}>
        <View>
          <Input label="Kab/Kota" onChangeText={value => cariKota(value)} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.ddItemList}>KOTA</Text>
            <Text style={styles.ddItemList}>ONGKIR</Text>
          </View>
          <ScrollView>
            {dtOngkirTampil.map((v, i) => {
              return (
                <TouchableOpacity
                  onPress={() => pressKota(v.kota, v.harga)}
                  style={{padding: 5, margin: 2, width: 300}}
                  key={i}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.ddItemList}>{v.kota}</Text>
                    <Text style={styles.ddItemList}>{v.harga}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => pressKota('LAINNYA', 0)}
              style={{padding: 5, margin: 2, width: 200}}
              key={'tdkada'}>
              <Text style={styles.ddItemList}>{'LAINNYA'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Overlay>
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
              value={dtUser.displayName}
              onChangeText={value =>
                setDtUser(prev => ({...prev, displayName: value}))
              }
            />
            <Input
              label="HP/ WA"
              placeholder="Nomor HP / WA"
              value={dtUser.phoneNumber}
              onChangeText={value =>
                setDtUser(prev => ({...prev, phoneNumber: value}))
              }
            />
            <Text>Alamat:</Text>
            <Input
              placeholder="Alamat..."
              numberOfLines={4}
              multiline={true}
              value={dtUser.alamat}
              onChangeText={value =>
                setDtUser(prev => ({...prev, alamat: value}))
              }
            />

            <Text style={styles.label}>Kabupaten / Kota</Text>
            <TouchableOpacity
              style={{
                marginBottom: 30,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.7,
              }}
              onPress={handleKota}>
              {dtUser.kota ? (
                <Text style={styles.value}>{dtUser.kota}</Text>
              ) : (
                <Text style={styles.valueErr}>Belum diatur!</Text>
              )}
            </TouchableOpacity>

            <Button title="Simpan" onPress={onSimpan} />
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

export default FrbAkun;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nama: {
    color: Konstanta.warna.satu,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {fontWeight: 'bold'},
  value: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Konstanta.warna.text,
    marginBottom: 10,
  },
  valueErr: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'red',
    marginBottom: 10,
  },
  btn: {borderRadius: 10, width: lebar - 70, marginBottom: 20},
  bottom: {backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
});
