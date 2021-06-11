import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import database from '@react-native-firebase/database';
import CardProdukSatuan from './CardProdukSatuan';
import {Card} from 'react-native-elements';

const KontainerHomeKoi = ({navigation}) => {
  const [tbData, setTbData] = useState({});

  useEffect(() => {
    const refProduk = database().ref('/produkSatuan');

    const updateProduk = refProduk
      .orderByChild('tampil')
      .equalTo(true)
      .limitToLast(20)
      .on('value', snapshot => {
        if (snapshot.exists()) {
          setTbData(snapshot.val());
        }
      });
    return () => {
      refProduk.off('value', updateProduk);
    };
  }, []);

  return (
    <View>
      {tbData && Object.keys(tbData).length > 0 && (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.theader}>JUAL KOI</Text>
          </View>
          <View style={styles.containerProducts}>
            {Object.keys(tbData).map((key, i) => {
              return (
                <View key={key}>
                  <CardProdukSatuan
                    dtKey={key}
                    data={tbData[key]}
                    onDetail={() =>
                      navigation.navigate('ProdukSatuanDetail', {
                        produkID: key,
                      })
                    }
                    onBeli={() =>
                      navigation.navigate('ProdukSatuanDetail', {
                        produkID: key,
                      })
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default KontainerHomeKoi;

const styles = StyleSheet.create({
  card: {backgroundColor: 'white', marginVertical: 5},
  containerProducts: {flexDirection: 'row', flexWrap: 'wrap'},
  header: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  theader: {fontWeight: 'bold', color: 'orangered', fontSize: 16},
});
