import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ribuan} from '../fungsi/Fungsi';
import Konstanta from '../fungsi/Konstanta';
import noImage from '../assets/noImage.jpg';
import moment from 'moment';
import storage from '@react-native-firebase/storage';

const windowWidth = Dimensions.get('window').width;
const setengah = windowWidth * 0.4;

const CardLelangAkan = ({dtkey, data, onPressDetail}) => {
  const sekarang = moment();
  const mulai = moment(data.mulai);
  const mulaiPada = mulai.diff(sekarang, 'seconds');

  const [img, setImg] = useState(null);
  const [hitung, setHitung] = useState(mulaiPada);
  const [tampilHitung, setTampilHitung] = useState('');

  let intervalRef = useRef();

  useEffect(() => {
    const tRef = `produk/${dtkey}/detail0.jpg`;
    let isMount = true;
    const refImg = storage().ref(tRef);
    refImg
      .getDownloadURL()
      .then(url => {
        isMount ? setImg(url) : null;
      })
      .catch(e => {
        console.log(e);
      });
    intervalRef.current = setInterval(kurangi, 1000);
    return () => {
      clearInterval(intervalRef.current);
      isMount = false;
    };
  }, []);

  useEffect(() => {
    setTampilHitung(tampilTimer(hitung));
    if (hitung === 0) {
      clearInterval(intervalRef.current);
      Alert.alert(
        'PERHATIAN',
        `Lelang ${data.nama} sudah dimulai. Tarik kebawah untuk refresh data`,
      );
    }
  }, [hitung]);

  const kurangi = () => {
    setHitung(prev => prev - 1);
  };
  const tampilTimer = secs => {
    var seconds = Number(secs);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);

    const str = [h, m, s]
      .map(v => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
    const newStr = d > 0 ? d + ' hari ' + str : str;
    return newStr;
  };

  return (
    <View style={styles.cardProduct}>
      <View style={styles.cardProductBorder}>
        <TouchableOpacity style={styles.productImgWrap} onPress={onPressDetail}>
          <FastImage
            style={styles.productImg}
            source={img ? {uri: img} : noImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.ProductInfoCard}>
          <Text
            style={styles.teksProduct}
            numberOfLines={2}
            ellipsizeMode="tail">
            {data.nama}
          </Text>
          <Text style={styles.teksterjual}>Jenis: {data.jenis}</Text>
          <Text style={styles.teksterjual}>{data.deskripsi}</Text>
          <View style={{alignItems: 'center', padding: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              {tampilHitung} lagi
            </Text>
          </View>

          <View style={styles.kotakMargin}>
            <View style={styles.kotakHarga}>
              <Text style={{fontSize: 12}}>OPEN BID</Text>
              <Text style={styles.hargaBaru}>{ribuan(data.openBid)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardLelangAkan;

const styles = StyleSheet.create({
  cardProduct: {
    padding: 5,
    backgroundColor: 'white',
  },
  cardProductBorder: {
    borderWidth: 0.6,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
  },
  productImgWrap: {borderRadius: 10},
  productImg: {height: setengah, width: setengah},
  ProductInfoCard: {paddingHorizontal: 10, flex: 1},
  wadahTombolBawah: {
    marginTop: 3,
    alignItems: 'center',
  },
  tombol: {
    flex: 1,
    flexDirection: 'row',
    // height: 35,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  tDetail: {
    backgroundColor: Konstanta.warna.dua,
  },
  btnBeli: {
    backgroundColor: Konstanta.warna.satu,
  },
  tBeli: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  textTombol: {color: 'white'},
  teksProduct: {
    color: Konstanta.warna.satu,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 5,
  },
  teksterjual: {color: Konstanta.warna.text, fontSize: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  rowBagikan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowHarga: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 35,
  },
  hargaLama: {
    color: Konstanta.warna.text,
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  hargaBaru: {
    color: Konstanta.warna.satu,
    fontWeight: 'bold',
    fontSize: 18,
  },
  kotakMargin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kotakHarga: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: Konstanta.warna.dua,
  },
  warnaSatu: {color: Konstanta.warna.satu},
  teksCenter: {textAlign: 'center', fontSize: 12},
});
