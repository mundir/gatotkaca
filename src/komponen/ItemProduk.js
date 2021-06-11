import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  Image,
} from 'react-native';
import Konstanta from '../fungsi/Konstanta';
import FastImage from 'react-native-fast-image';
import {ribuan} from '../fungsi/Fungsi';
import Icon from 'react-native-vector-icons/FontAwesome';
import sold from '../assets/sold2.png';
import noImage from '../assets/noImage.jpg';
import storage from '@react-native-firebase/storage';

const lebar = Dimensions.get('window').width;
const numColumns = 2;

const ItemProduk = ({datas, onDetail, onBeli}) => {
  const [img, setImg] = React.useState(null);
  const tRef = `produk/${datas.id}/detail0.jpg`;

  React.useEffect(() => {
    let isMount = true;
    if (!datas.empty) {
      const refImg = storage().ref(tRef);
      refImg
        .getDownloadURL()
        .then(url => {
          isMount ? setImg({uri: url}) : noImage;
        })
        .catch(e => {
          console.log(e);
        });
    }
    return () => (isMount = false);
  }, []);

  if (datas.empty) {
    return <View style={[styles.itemStyle, styles.itemInvisible]} />;
  }

  return (
    <View style={styles.itemStyle}>
      <View style={styles.cardItem}>
        <View>
          <TouchableOpacity onPress={onDetail} style={styles.imgWrap}>
            <FastImage
              style={styles.productImg}
              source={img}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          {datas.status === 'habis' && (
            <View style={styles.soldWrap}>
              <Image source={sold} style={styles.soldImg} />
            </View>
          )}
        </View>
        <View style={styles.cardData}>
          <Text
            style={styles.tNamaProduk}
            numberOfLines={2}
            ellipsizeMode="tail">
            {datas.nama}
          </Text>
          <Text style={styles.tHarga}>Rp {ribuan(datas.harga)}</Text>
          <TouchableOpacity
            disabled={datas.status === 'habis' ? true : false}
            style={styles.tombol}
            onPress={onBeli}>
            <Icon name="cart-plus" size={18} color="#fff" />
            <Text style={styles.tombolText}> Beli </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemProduk;

const styles = StyleSheet.create({
  containerList: {padding: 5, marginBottom: 100},
  itemStyle: {
    padding: 3,
    // height: (lebar / numColumns) * 1.7,
    width: Math.floor(lebar / numColumns) - 5,
  },
  cardItem: {
    backgroundColor: 'white',
    flex: 1,
    borderWidth: 0.5,
    borderColor: Konstanta.warna.disabled,
    borderRadius: 10,
  },
  imgWrap: {borderRadius: 10},
  productImg: {
    borderRadius: 10,
    width: '100%',
    height: (lebar / numColumns) * 1.2,
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
  cardData: {padding: 10},
  tNamaProduk: {color: Konstanta.warna.satu},
  fieldRow: {flexDirection: 'row', justifyContent: 'space-between'},
  rowBagikan: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tField: {fontSize: 10, color: Konstanta.warna.text, textAlign: 'center'},
  tHarga: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Konstanta.warna.satu,
  },
  tombol: {
    backgroundColor: Konstanta.warna.satu,
    borderRadius: 10,
    flexDirection: 'row',
    paddingVertical: 11,
    justifyContent: 'center',
  },
  tombolText: {fontWeight: 'bold', color: 'white'},
  itemInvisible: {backgroundColor: 'transparent'},
});
