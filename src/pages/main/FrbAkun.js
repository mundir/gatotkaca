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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Input,
  Button,
  BottomSheet,
  ListItem,
  Card,
  Overlay,
} from 'react-native-elements';
import {AuthContext} from './AuthProvider';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

import Loading from '../../komponen/Loading';
import noImage from '../../assets/noImage.jpg';
import Konstanta from '../../fungsi/Konstanta';
import TanyakanWA from '../../fungsi/TanyakanWA';

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
  const [tampilOvlFoto, setTampilOvlFoto] = useState(false);
  const [tampilOvlFotoShow, setTampilOvlFotoShow] = useState(false);
  const [tampilOverlay, setTampilOverlay] = useState(false);
  const [tampilOverlayKota, setTampilOverlayKota] = useState(false);
  const [dtOngkir, setDtOngkir] = useState([]);
  const [dtOngkirTampil, setDtOngkirTampil] = useState([]);
  const [dtProvinsi, setDtProvinsi] = useState([]);
  const [dtKotas, setDtKotas] = useState([]);
  const [dtListKota, setListKota] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUser();
    getOngkir();
    console.log(cobas());
  }, []);

  function cobas() {
    return 'oke';
  }

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
  // 73393cdc6d1f5ae874fbfd442938d649
  function getProvinsi() {
    setIsLoading(true);
    fetch('https://api.rajaongkir.com/starter/province', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        key: '73393cdc6d1f5ae874fbfd442938d649',
      },
      // body: JSON.stringify({
      //   firstParam: 'yourValue',
      //   secondParam: 'yourOtherValue',
      // }),
    })
      .then(response => response.json())
      .then(json => {
        const hasil = json.rajaongkir.results;
        const hasil2 = hasil.map((v, i) => {
          return {label: v.province, value: v.province_id, key: i};
        });
        setDtProvinsi(hasil2);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  function getListKota(propinsi) {
    setIsLoading(true);
    fetch(`https://api.rajaongkir.com/starter/city?province=${propinsi}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        key: '73393cdc6d1f5ae874fbfd442938d649',
      },
    })
      .then(response => response.json())
      .then(json => {
        const hasil = json.rajaongkir.results;
        setDtKotas(hasil);
        const hasil2 = hasil.map((v, i) => {
          return {label: v.city_name + ' ' + v.type, value: v.city_id, key: i};
        });
        setListKota(hasil2);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  function getKota(id) {
    setIsLoading(true);
    fetch(`https://api.rajaongkir.com/starter/city?id=${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        key: '73393cdc6d1f5ae874fbfd442938d649',
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log(json.rajaongkir.results);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
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
    setTampilOvlFoto(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: lebar,
        maxHeight: tinggi,
      },
      hasil => {
        if (!hasil.didCancel) {
          const ast = hasil.assets[0];
          setFoto({uri: ast.uri});
          uploadFoto(ast);
        }
      },
    );
  }

  function ambilGalery() {
    setTampilOvlFoto(false);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: lebar,
        maxHeight: tinggi,
      },
      hasil => {
        if (!hasil.didCancel) {
          const ast = hasil.assets[0];
          setFoto({uri: ast.uri});
          uploadFoto(ast);
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
    if (!dtProvinsi.length) {
      getProvinsi();
    }
  }

  function coba(v) {
    getListKota(v.value);
    setDtUser(prev => ({
      ...prev,
      provinsi: v.label,
    }));
    setTampilOverlay(false);
  }

  function getRowKota(v) {
    let tmp = [...dtKotas];
    let idx = tmp.findIndex(x => x.city_id === v.value);
    let rowTmp = tmp[idx];
    // console.log(rowTmp);
    let clarista = [...dtOngkir];
    let idxc = clarista.findIndex(x => x.id == v.value);
    let rowCl = clarista[idxc];
    console.log(rowCl);
    const ongkir = rowCl ? rowCl.harga : 0;
    setDtUser(prev => ({
      ...prev,
      provinsi: rowTmp.province,
      kotaID: rowTmp.city_id,
      kotaNama: rowTmp.city_name + ' ' + rowTmp.type,
      kodePos: rowTmp.postal_code,
      ongkir: ongkir,
    }));
    setTampilOverlayKota(false);
  }

  function tampilkanListKota() {
    if (!dtListKota.length) {
      Alert.alert('PERHATIAN', 'Pilih Provinsi telebih dahulu');
      return;
    }
    setTampilOverlayKota(true);
  }

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

  // const arrList = user.isAdmin
  //   ? bottomListAdmin.concat(bottomList)
  //   : bottomList;
  const arrList = bottomList;

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <TouchableOpacity onPress={() => setTampilOvlFotoShow(true)}>
              <Image source={foto ? foto : noImage} style={styles.img} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTampilOvlFoto(true)}
              style={{position: 'absolute', bottom: 0, right: -10}}>
              <Icon name="edit" color="orangered" size={20} />
            </TouchableOpacity>
          </View>
          <Card wrapperStyle={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={editUser}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                alignItems: 'center',
              }}>
              <Icon name="edit" color="orangered" size={20} />
              <Text style={{color: 'orangered'}}>Edit</Text>
            </TouchableOpacity>
            <Text style={styles.nama}>{user.displayName}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
            <Text style={styles.label}>HP / WA</Text>
            {user.phoneNumber ? (
              <Text style={styles.value}>{user.phoneNumber}</Text>
            ) : (
              <Text style={styles.valueErr}>Belum diatur!</Text>
            )}

            <Text style={styles.label}>Provinsi</Text>
            {user.provinsi ? (
              <Text style={styles.value}>{user.provinsi}</Text>
            ) : (
              <Text style={styles.valueErr}>Belum diatur!</Text>
            )}
            <Text style={styles.label}>Kabupaten / Kota</Text>
            {user.kotaNama ? (
              <Text style={styles.value}>
                {user.kotaNama} - {user.kotaID}
              </Text>
            ) : (
              <Text style={styles.valueErr}>Belum diatur!</Text>
            )}
            <Text style={styles.label}>Detail Alamat</Text>
            {user.alamat ? (
              <Text style={styles.value} multiline={true} numberOfLines={4}>
                {user.alamat}
              </Text>
            ) : (
              <Text style={styles.valueErr}>Belum diatur!</Text>
            )}

            <Text style={styles.label}>Ongkir KOI</Text>
            {'ongkir' in user ? (
              user.ongkir ? (
                <Text style={styles.value}>{user.ongkir}</Text>
              ) : (
                <View style={{alignItems: 'center', marginBottom: 20}}>
                  <Text style={styles.valueErr}>
                    Alamat diluar jangkauan pengiriman
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      TanyakanWA(
                        `Alamat saya ${user.kotaNama} diluar jangkauan pengiriman. Tolong solusinya`,
                      )
                    }
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'green',
                      borderRadius: 5,
                    }}>
                    <Icon name="whatsapp" color="white" />
                    <Text style={{color: 'white'}}> Hubungi Admin</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <Text style={styles.valueErr}>Belum diatur!</Text>
            )}
          </Card>

          {user.isAdmin && (
            <Button
              title="Admin"
              type="outline"
              containerStyle={{marginTop: 20}}
              buttonStyle={[styles.btn, {borderColor: 'red'}]}
              titleStyle={{color: 'red'}}
              onPress={() => navigation.navigate('AdminHome')}
            />
          )}

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
      </ScrollView>

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
        isVisible={tampilOvlFotoShow}
        onBackdropPress={() => setTampilOvlFotoShow(false)}>
        <Image
          source={foto ? foto : noImage}
          style={{width: lebar, height: lebar}}
        />
      </Overlay>
      <Overlay
        isVisible={tampilOvlFoto}
        onBackdropPress={() => setTampilOvlFoto(false)}>
        <View style={{padding: 5}}>
          <Button
            title="Ambil Kamera"
            type="outline"
            // containerStyle={{marginTop: 20}}
            buttonStyle={[styles.btn, {borderColor: 'red'}]}
            titleStyle={{color: 'red'}}
            onPress={ambilKamera}
          />
          <Button
            title="Ambil Galeri"
            type="outline"
            // containerStyle={{marginTop: 20}}
            buttonStyle={[styles.btn, {borderColor: 'blue'}]}
            titleStyle={{color: 'blue'}}
            onPress={ambilGalery}
          />
        </View>
      </Overlay>
      <Overlay
        isVisible={tampilOverlay}
        onBackdropPress={() => setTampilOverlay(false)}>
        <TampilList namaLabel="Provinsi" data={dtProvinsi} onPress={coba} />
      </Overlay>

      <Overlay
        isVisible={tampilOverlayKota}
        onBackdropPress={() => setTampilOverlayKota(false)}>
        <TampilList
          namaLabel="Kabupaten / Kota"
          data={dtListKota}
          onPress={getRowKota}
        />
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

            <Text style={styles.label}>Provinsi</Text>
            {isLoading ? (
              <ActivityIndicator color="red" />
            ) : (
              <TouchableOpacity
                style={{
                  marginBottom: 30,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.7,
                }}
                onPress={() => setTampilOverlay(true)}>
                {dtUser.provinsi ? (
                  <Text style={styles.value}>{dtUser.provinsi}</Text>
                ) : (
                  <Text style={styles.valueErr}>Belum diatur!</Text>
                )}
              </TouchableOpacity>
            )}

            <Text style={styles.label}>Kabupaten / Kota</Text>
            {isLoading ? (
              <ActivityIndicator color="red" />
            ) : (
              <TouchableOpacity
                style={{
                  marginBottom: 30,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 0.7,
                }}
                onPress={tampilkanListKota}>
                {dtUser.kotaNama ? (
                  <Text style={styles.value}>{dtUser.kotaNama}</Text>
                ) : (
                  <Text style={styles.valueErr}>Belum diatur!</Text>
                )}
              </TouchableOpacity>
            )}

            <Input
              label="Alamat"
              placeholder="Alamat..."
              numberOfLines={3}
              multiline={true}
              textAlignVertical="top"
              value={dtUser.alamat}
              onChangeText={value =>
                setDtUser(prev => ({...prev, alamat: value}))
              }
            />

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
      {isLoading && <Loading />}
    </>
  );
};

export default FrbAkun;

const TampilList = ({namaLabel, data, onPress}) => {
  const [dtTampil, setDtTampil] = useState(data);

  function mencari(t) {
    const tmp = [...data];
    const hasilFilter = tmp.filter(v => {
      let label = v.label ? v.label.toLowerCase() : '';
      return label.includes(t.toLowerCase());
    });
    setDtTampil(hasilFilter);
  }
  return (
    <View>
      <Input label={namaLabel} onChangeText={value => mencari(value)} />
      <ScrollView>
        {dtTampil.map((v, i) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(v)}
              style={{padding: 5, margin: 2, width: 300}}
              key={i}>
              <Text style={styles.ddItemList}>{v.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
    marginBottom: 5,
  },
  valueErr: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'red',
    marginBottom: 5,
  },
  btn: {borderRadius: 10, width: lebar - 70, marginBottom: 20},
  bottom: {backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'},
  modal: {margin: 20, padding: 20},
  modalOut: {flex: 1},
});
