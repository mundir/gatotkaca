/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Headerku from '../../komponen/Headerku';
import Carousel from '../../komponen/Carousel';
import Kategori from '../../komponen/Kategori';
import WelcomeCard from '../../komponen/WelcomeCard';
import SplashScreen from '../../komponen/SplashScreen';
import KontainerHomeKoi from '../../komponen/KontainerHomeKoi';
import KontainerHomeLelang from '../../komponen/KontainerHomeLelang';
import {tunggu} from '../../fungsi/Fungsi';
const lebar = Dimensions.get('window').width;
const tinggi = Dimensions.get('window').height;

const Kosong = ({navigation}) => {
  const [isInit, setIsInit] = useState(true);

  React.useState(() => {
    tunggu(2000).then(() => setIsInit(false));
  });
  return (
    <View style={{flex: 1}}>
      <Headerku
        judul="jawa koi center"
        badgeValue={0}
        icon="shopping-basket"
        onPressKanan={() => navigation.navigate('Keranjang')}
      />
      <ScrollView>
        <Carousel />
        <WelcomeCard />
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.youtube.com/channel/UCXmcspAIcrsC8IfMftmrNHQ',
            );
          }}
          style={{
            backgroundColor: 'mistyrose',
            padding: 10,
            marginHorizontal: 10,
            marginVertical: 5,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Icon name="youtube" size={20} color="red" />
          <Text style={{color: 'red', fontWeight: 'bold'}}>
            {'  '}JKC Youtube Channel
          </Text>
        </TouchableOpacity>
        <Kategori navigation={navigation} />
        <KontainerHomeLelang navigation={navigation} />
        <KontainerHomeKoi navigation={navigation} />
        {isInit && (
          <View style={styles.splashScreen}>
            <SplashScreen />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Kosong;

const styles = StyleSheet.create({
  splashScreen: {
    width: lebar,
    height: tinggi,
    // backgroundColor: 'rgba(92, 92, 92, 0.3)',
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
