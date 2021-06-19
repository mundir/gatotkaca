import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ToastAndroid,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import Headerku from '../../komponen/Headerku';
import database from '@react-native-firebase/database';
import moment from 'moment';
import CardLelang from '../../komponen/CardLelang';
import CardLelangAkan from '../../komponen/CardLelangAkan';
import CardLelangRow from '../../komponen/CardLelangRow';
import {lebar} from '../../fungsi/Dimensi';
import TanyakanWA from '../../fungsi/TanyakanWA';
const FrbLelang = ({navigation}) => {
  const [dtSedang, setDtSedang] = useState([]);
  const [dtAkan, setDtAkan] = useState([]);
  const [dtAturanLelang, setDtAturanLelang] = useState('');
  const [tampilOverlay, setTampilOverlay] = useState(true);
  const [secondLoad, setSecondLoad] = useState(null);

  const updateRef = React.useRef(false);
  useEffect(() => {
    getDtPeraturan();
    const dbRef = database().ref('/lelang');

    const getDtSedang = dbRef
      .orderByChild('status')
      .equalTo('sedang')
      .on('value', snapshot => {
        if (snapshot.exists()) {
          setDtSedang(snapshot.val());
        }
      });
    const getDtAkan = dbRef
      .orderByChild('status')
      .equalTo('akan')
      .on('value', snapshot => {
        if (snapshot.exists()) {
          setDtAkan(snapshot.val());
        }
      });

    var pertama = true;
    const historyRef = database().ref('/lelangHistory');
    const getHistory = historyRef.limitToLast(1).on('child_added', snapshot => {
      const hasil = snapshot.val();
      console.log(hasil);
      if (pertama) {
        pertama = false;
      } else {
        ToastAndroid.showWithGravity(
          `${hasil.namaLelang} UPBID ${hasil.bid} oleh ${hasil.namaUser}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      // updateRef.current = hasil;
    });
    return () => {
      dbRef.off('value', getDtSedang);
      dbRef.off('value', getDtAkan);
      historyRef.off('child_added', getHistory);
    };
  }, []);

  function getDtPeraturan() {
    const myref = database().ref('setting/aturanLelang');
    myref.once('value').then(snapshot => {
      snapshot.exists() ? setDtAturanLelang(snapshot.val()) : null;
    });
  }

  return (
    <View style={{flex: 1}}>
      <Headerku
        judul="Data Lelang"
        tKanan="MyBID"
        onPressKanan={() => navigation.navigate('Mybid')}
      />
      <ScrollView>
        {dtSedang && Object.keys(dtSedang).length > 0 ? (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>LELANG SEDANG BERLANGSUNG</Text>
            </View>
            <View>
              {Object.keys(dtSedang).map((key, i) => {
                return (
                  <View key={key}>
                    <CardLelangRow
                      dtkey={key}
                      data={dtSedang[key]}
                      onPressDetail={() =>
                        navigation.navigate('LelangDetail', {lelangID: key})
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <NoData />
        )}
        {dtAkan && Object.keys(dtAkan).length > 0 ? (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.theader}>LELANG AKAN DATANG</Text>
            </View>
            <View>
              {Object.keys(dtAkan).map((key, i) => {
                return (
                  <View key={key}>
                    <CardLelangAkan
                      dtkey={key}
                      data={dtAkan[key]}
                      onPressDetail={() =>
                        navigation.navigate('LelangDetailAkan', {lelangID: key})
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <NoData />
        )}
      </ScrollView>
      <Overlay
        isVisible={tampilOverlay}
        onBackdropPress={() => setTampilOverlay(false)}>
        <View style={{width: lebar * 0.7}}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
            TATA TERTIB LELANG
          </Text>
          <Text>{dtAturanLelang}</Text>
          <View style={{paddingHorizontal: 20, paddingTop: 20}}>
            <Button
              title="WA Admin"
              color="green"
              onPress={() => TanyakanWA('Info Lelang')}
            />
          </View>
          <View
            style={{paddingHorizontal: 20, paddingTop: 15, paddingBottom: 20}}>
            <Button
              title="OK"
              color="orangered"
              onPress={() => setTampilOverlay(false)}
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
};

export default FrbLelang;

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

const NoData = () => (
  <View
    style={{
      alignItems: 'center',
      padding: 30,
      backgroundColor: 'white',
      margin: 10,
      borderRadius: 10,
    }}>
    <Text style={{color: 'red', fontStyle: 'italic'}}>
      Maaf, hari ini tidak ada Lelang
    </Text>
  </View>
);
