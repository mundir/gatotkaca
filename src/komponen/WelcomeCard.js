import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../pages/main/AuthProvider';
import database from '@react-native-firebase/database';
import Konstanta from './Konstanta';
const WelcomeCard = () => {
  const [tbData, setTbData] = useState({});
  const {user} = React.useContext(AuthContext);

  useEffect(() => {
    const refInfo = database().ref('/setting/infoWelcome');
    const updateInfo = refInfo.on('value', snapshot => {
      snapshot.exists() && setTbData(snapshot.val());
    });
    return () => {
      refInfo.off('value', updateInfo);
    };
  }, []);
  return (
    <View>
      <View style={styles.cardSK}>
        <Text style={styles.skHai}>Hai, {user.displayName}</Text>
        <Text style={styles.skJudul}>{tbData.judul}</Text>
        <Text style={styles.skIsi}>{tbData.isi}</Text>
      </View>
    </View>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  skJudul: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: Konstanta.warna.satu,
  },
  skHai: {color: Konstanta.warna.text, textAlign: 'center'},
  skIsi: {color: Konstanta.warna.text},
  container: {flexDirection: 'column'},
  card: {backgroundColor: 'white', marginVertical: 5},
  cardSK: {backgroundColor: 'white', marginVertical: 5, padding: 10},
});
