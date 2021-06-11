import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import database from '@react-native-firebase/database';
import Konstanta from '../fungsi/Konstanta';
const Kategori = ({navigation}) => {
  const [tbData, setTbData] = useState([]);

  useEffect(() => {
    let isMount = true;
    getDt(isMount);
    return () => {
      isMount = false;
    };
  }, []);

  function getDt(isMount) {
    database()
      .ref('/kategori')
      .orderByChild('urutan')
      .once('value')
      .then(snapshot => {
        let tmpArr = [];
        snapshot.forEach(v => {
          tmpArr.push({...v.val(), id: v.key});
        });
        if (isMount) setTbData(tmpArr);
      });
  }

  return (
    <View>
      {tbData.length > 0 && (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.theader}>KATEGORI</Text>
          </View>
          <View style={styles.rowKategori}>
            <ScrollView horizontal={true}>
              {tbData.map((v, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() =>
                      navigation.navigate(
                        v.id === 'KOI' ? 'ProdukSatuan' : 'Produk',
                        {
                          kategori: v.id,
                          namaKategori: v.nama,
                        },
                      )
                    }>
                    <View style={styles.boxAvatar}>
                      <Image
                        source={{
                          uri: v.img,
                        }}
                        style={styles.imgKat}
                      />
                      <Text
                        numberOfLines={3}
                        lineBreakMode="tail"
                        style={styles.tKat}>
                        {v.nama}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default Kategori;

const styles = StyleSheet.create({
  card: {backgroundColor: 'white', marginVertical: 5},
  header: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: Konstanta.warna.disabled,
  },
  theader: {fontWeight: 'bold', color: Konstanta.warna.satu, fontSize: 16},
  rowKategori: {padding: 10},
  boxAvatar: {
    marginHorizontal: 2,
    alignItems: 'center',
  },
  imgKat: {width: 100, height: 100, borderRadius: 50},
  tKat: {width: 110, textAlign: 'center'},
});
