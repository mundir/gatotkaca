import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import database from '@react-native-firebase/database';
import CardLelang from './CardLelang';

const KontainerHomeLelang = ({navigation}) => {
  const [tbData, setTbData] = useState({});

  useEffect(() => {
    const dbRef = database().ref('/lelang');

    const getDt = dbRef
      .orderByChild('status')
      .equalTo('sedang')
      .on('value', snapshot => {
        if (snapshot.exists()) {
          setTbData(snapshot.val());
        }
      });
    return () => {
      dbRef.off('value', getDt);
    };
  }, []);

  return (
    <View>
      {tbData && Object.keys(tbData).length > 0 && (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.theader}>LELANG TERBARU</Text>
          </View>
          <View style={styles.containerProducts}>
            {Object.keys(tbData).map((key, i) => {
              return (
                <View key={key}>
                  <CardLelang
                    dtkey={key}
                    data={tbData[key]}
                    onPressDetail={() =>
                      navigation.navigate('LelangDetail', {lelangID: key})
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

export default KontainerHomeLelang;

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
