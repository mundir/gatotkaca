import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import database from '@react-native-firebase/database';
import {Overlay, SearchBar, Input} from 'react-native-elements';
import {ribuan} from '../../fungsi/Fungsi';
const Pengguna = () => {
  const [tbData, setTbData] = useState([]);
  const [tbDataTampil, setTbDataTampil] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [tampilForm, setTampilForm] = useState(false);
  const [tampilOverlay, setTampilOverlay] = useState(false);
  const [cari, setCari] = useState('');

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    const dbRef = database().ref('/users');
    dbRef.once('value').then(snapshot => {
      let arr = [];
      snapshot.forEach(v => {
        arr.push({...v.val(), id: v.key});
      });
      setTbData(arr);
      setTbDataTampil(arr);
    });
  }

  function mencari() {
    const tmp = [...tbData];
    const newTmp = tmp.filter(v => {
      let nama = v.displayName.toLowerCase();
      return nama.includes(cari.toLowerCase());
    });
    console.log(newTmp);
    setTbDataTampil(newTmp);
  }

  function resetCari() {
    setCari('');
    setTbDataTampil(tbData);
  }

  function onEdit() {
    setTampilOverlay(false);
    setTampilForm(true);
  }

  function onHapus() {
    Alert.alert(
      'PERHATIAN',
      'Apakah yakin akan menghapus data ' + selectedRow.displayName,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => menghapusDb()},
      ],
    );
  }

  function menghapusDb() {
    let id = selectedRow.id;
    const dbRef = database().ref('/users/' + id);
    dbRef
      .set(null)
      .then(() => {
        let tmp = [...tbData];
        let idx = tmp.findIndex(x => x.id === id);
        tmp.splice(idx, 1);
        setTbData(tmp);
        setTbDataTampil(tmp);
        setTampilForm(false);
      })
      .catch(e => console.log(e));
  }

  function onUpdate() {
    let id = selectedRow.id;
    const dbRef = database().ref('/users/' + id);
    dbRef
      .update(selectedRow)
      .then(() => {
        let tmp = [...tbData];
        let idx = tmp.findIndex(x => x.id === id);
        tmp[idx] = selectedRow;
        setTbData(tmp);
        setTbDataTampil(tmp);
        setTampilForm(false);
      })
      .catch(e => console.log(e));
  }

  const renderItem = ({item}) => {
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedRow(item);
          setTampilOverlay(true);
        }}
      />
    );
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <SearchBar
        placeholder="cari nama"
        value={cari}
        onChangeText={text => setCari(text)}
        platform="android"
        onClear={resetCari}
        onEndEditing={mencari}
      />
      <FlatList
        data={tbDataTampil}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        // ListHeaderComponent={<ItemCari />}
      />
      <Overlay
        isVisible={tampilOverlay}
        onBackdropPress={() => setTampilOverlay(false)}>
        <View style={styles.overlay}>
          <View style={styles.btn}>
            <Button title="EDIT" color="green" onPress={onEdit} />
          </View>
          <View style={styles.btn}>
            <Button title="HAPUS" color="red" onPress={onHapus} />
          </View>
        </View>
      </Overlay>
      <Overlay
        isVisible={tampilForm}
        onBackdropPress={() => setTampilForm(false)}>
        <FormEdit
          data={selectedRow}
          setSelectedRow={setSelectedRow}
          onUpdate={onUpdate}
        />
      </Overlay>
    </View>
  );
};

export default Pengguna;

const Item = ({item, onPress}) => (
  <View style={styles.item}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.title} selectable>
          {item.uid}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.title} selectable>
          {item.displayName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>email</Text>
        <Text style={styles.title} selectable>
          {item.email}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Telepon</Text>
        <Text style={styles.title} selectable>
          {item.phoneNumber}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Ongkir KOI</Text>
        <Text style={styles.title} selectable>
          {item.ongkir ? (
            ribuan(item.ongkir)
          ) : (
            <Text style={{color: 'red'}}>Belum diatur!</Text>
          )}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Provinsi</Text>
        <Text style={styles.title} selectable>
          {item.provinsi}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kab / Kota</Text>
        <Text style={styles.title} selectable>
          {item.kotaNama} - {item.kotaID}{' '}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alamat</Text>
        <Text
          selectable
          style={styles.title}
          numberOfLines={4}
          multiline
          lineBreakMode="tail">
          {item.alamat}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>User Level</Text>
        <Text style={styles.title}>{item.isAdmin ? 'ADMIN' : 'USER'}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const FormEdit = ({data, setSelectedRow, onUpdate}) => {
  return (
    <View style={{width: 300}}>
      <ScrollView>
        <Input
          label="Nama"
          value={data.displayName}
          onChangeText={t =>
            setSelectedRow(prev => ({...prev, displayName: t}))
          }
        />
        <Input
          label="Telepon/WA"
          value={data.phoneNumber}
          onChangeText={t =>
            setSelectedRow(prev => ({...prev, phoneNumber: t}))
          }
        />
        <Input
          label="Ongkir KOI"
          value={data.ongkir ? '' + data.ongkir : null}
          keyboardType="numeric"
          onChangeText={t =>
            setSelectedRow(prev => ({...prev, ongkir: Number(t)}))
          }
        />
        <Input
          label="Alamat Detail"
          value={data.alamat}
          textAlignVertical="top"
          numberOfLines={3}
          multiline
          onChangeText={t => setSelectedRow(prev => ({...prev, alamat: t}))}
        />
        <View style={{padding: 10, marginBottom: 20}}>
          <Button title="UPDATE" onPress={onUpdate} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    marginBottom: 5,
  },
  row: {flexDirection: 'row'},
  label: {width: 80, fontWeight: 'bold'},
  title: {flex: 1, fontStyle: 'italic'},
  overlay: {padding: 10, width: 250, flexDirection: 'row'},
  btn: {flex: 1, margin: 10},
  edit: {position: 'absolute', right: 0, padding: 10, backgroundColor: 'green'},
});
