import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import ItemSatuan from '../../komponen/ItemSatuan';
import database from '@react-native-firebase/database';
import {SearchBar} from 'react-native-elements';
import Konstanta from '../../fungsi/Konstanta';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const ProdukSatuan = ({navigation}) => {
  const [tbData, setTbData] = useState([]);
  const [tbTampil, setTbTampil] = useState([]);
  const [filterJenis, setFilterJenis] = useState([]);
  const [cari, setCari] = useState('');
  const [tfilter, setTfilter] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    let isMount = true;
    getTbData(isMount);
    getFilterJenis(isMount);
    return () => (isMount = false);
  }, []);

  function getTbData(isMount) {
    database()
      .ref('/produkSatuan')
      .orderByChild('tampil')
      .equalTo(true)
      .once('value')
      .then(snapshot => {
        if (isMount) {
          let newArr = [];
          snapshot.forEach(x => newArr.push({...x.val(), id: x.key}));
          setTbData(newArr);
          setTbTampil(newArr);
          setRefreshToken(new Date().getTime());
        }
      });
  }
  function getFilterJenis(isMount) {
    database()
      .ref('/setting/filterJenis')
      .once('value')
      .then(snapshot => {
        if (isMount) {
          setFilterJenis([...snapshot.val(), 'RESET']);
        }
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

  function mefilter(i) {
    const tf = filterJenis[i];
    if (tf === 'RESET') {
      setTbTampil(tbData);
      setExpanded(false);
      setTfilter('');
      return;
    }
    const tmp = [...tbData];
    const hasilFilter = tmp.filter(v => {
      let jenis = v.jenis ? v.jenis.toLowerCase() : '';
      return jenis === tf;
    });
    setTbTampil(hasilFilter);
    setExpanded(false);
    setTfilter(tf);
  }

  const renderItem = ({item}) => {
    return (
      <ItemSatuan
        datas={item}
        onDetail={() =>
          navigation.navigate('ProdukSatuanDetail', {
            produkID: item.id,
          })
        }
        onBeli={() =>
          navigation.navigate('ProdukSatuanDetail', {
            produkID: item.id,
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Cari Nama Produk ..."
        onChangeText={text => setCari(text)}
        value={cari}
        platform="android"
        onClear={resetCari}
        onSubmitEditing={mencari}
      />
      <ListItem.Accordion
        content={
          <>
            <Icon name="filter" size={20} />
            <ListItem.Content>
              <ListItem.Title>Filter Jenis {tfilter}</ListItem.Title>
            </ListItem.Content>
          </>
        }
        noIcon
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        {filterJenis.map((l, i) => (
          <ListItem key={i} onPress={() => mefilter(i)} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{l}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </ListItem.Accordion>
      <View style={styles.containerList}>
        <FlatList
          data={formatData(tbTampil)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          // extraData={refreshToken}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProdukSatuan;

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
