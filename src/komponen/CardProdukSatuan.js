import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '@react-native-firebase/storage';
import Konstanta from '../fungsi/Konstanta';
import FastImage from 'react-native-fast-image';
import {ribuan} from '../fungsi/Fungsi';
import sold from '../assets/sold2.png';
import noImage from '../assets/noImage.jpg';

const windowWidth = Dimensions.get('window').width;
const setengah = windowWidth / 2 - 2;

const CardProdukSatuan = ({dtKey, data, onDetail, onBeli}) => {
  const tRef = `produk/${dtKey}/detail0.jpg`;
  const [img, setImg] = React.useState(null);

  React.useEffect(() => {
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
    return () => (isMount = false);
  }, []);

  return (
    <View style={styles.cardProduct}>
      <View style={styles.cardProductBorder}>
        <View style={styles.productImgWrap}>
          <TouchableOpacity onPress={onDetail}>
            <FastImage
              style={styles.productImg}
              source={img ? {uri: img} : noImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          {data.status === 'habis' && (
            <View style={styles.soldWrap}>
              <Image source={sold} style={styles.soldImg} />
            </View>
          )}
        </View>
        <View style={styles.ProductInfoCard}>
          <Text
            style={styles.teksProduct}
            numberOfLines={2}
            ellipsizeMode="tail">
            {data.nama}
          </Text>
          <Text style={styles.teksterjual}>Jenis {data.jenis}</Text>

          <View style={styles.rowHarga}>
            <Text style={styles.hargaBaru}>Rp{ribuan(data.harga)}</Text>
          </View>
          <View style={styles.wadahTombolBawah}>
            <TouchableOpacity
              disabled={data.status === 'habis' ? true : false}
              style={[styles.tombol, styles.tBeli]}
              onPress={onBeli}>
              <Icon name="cart-plus" size={18} color="#fff" />
              <Text style={styles.textTombol}> Beli </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardProdukSatuan;

const styles = StyleSheet.create({
  cardProduct: {
    width: setengah,
    padding: 5,
  },
  cardProductBorder: {
    borderWidth: 1,
    borderColor: Konstanta.warna.disabled,
    borderRadius: 10,
    padding: 5,
  },
  soldWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.37)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  soldImg: {width: '100%', height: 120, resizeMode: 'contain'},
  productImgWrap: {height: setengah, borderRadius: 10},
  productImg: {height: setengah},
  wadahTombolBawah: {
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  tBeli: {
    backgroundColor: Konstanta.warna.dua,
  },
  textTombol: {color: 'white'},
  teksProduct: {
    color: Konstanta.warna.dua,
    minHeight: 37,
    textAlign: 'justify',
  },
  teksterjual: {color: Konstanta.warna.text, fontSize: 10},
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
});
