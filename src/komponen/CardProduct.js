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
import Konstanta from './Konstanta';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {ribuan, toRB} from './Fungsi';
import noImage from '../assets/noImage.jpg';
import sold from '../assets/sold2.png';

const windowWidth = Dimensions.get('window').width;
const setengah = windowWidth / 2 - 2;

const CardProduct = props => {
  const data = props.data;

  const harga = data.harga;
  const diskon = Math.floor((data.diskon / 100) * harga);

  const url =
    data.img === 'noImage.jpg'
      ? noImage
      : {
          uri: `${Konstanta.api.imgBarang}/${data.id}/${data.img}`,
        };
  return (
    <View style={styles.cardProduct}>
      <View style={styles.cardProductBorder}>
        <View style={styles.productImgWrap}>
          <TouchableOpacity onPress={props.onPressDetail}>
            <FastImage
              style={styles.productImg}
              source={url}
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
          <View style={styles.rowBagikan}>
            <TouchableOpacity style={styles.btnWA} onPress={props.onPressChat}>
              <Text style={{color: 'green'}}>
                <Icon name="whatsapp" size={16} color="green" /> Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onPressShare}>
              <Text style={{color: Konstanta.warna.dua}}>
                <Icon name="share-alt" size={16} color={Konstanta.warna.dua} />{' '}
                Bagikan
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.teksterjual}>Tersedia {data.stok}</Text>
            <Text style={styles.teksterjual}>Terjual {toRB(data.terjual)}</Text>
          </View> */}

          <View style={styles.rowHarga}>
            {data.diskon !== 0 ? (
              <View>
                <Text style={styles.hargaLama}>{ribuan(harga)}</Text>
                <Text style={styles.teksterjual}>Disc {data.diskon}%</Text>
              </View>
            ) : null}
            <Text style={styles.hargaBaru}>Rp{ribuan(harga - diskon)}</Text>
          </View>
          <View style={styles.wadahTombolBawah}>
            <TouchableOpacity
              disabled={data.status === 'habis' ? true : false}
              style={[styles.tombol, styles.tBeli]}
              onPress={props.onPressBeli}>
              <Icon name="cart-plus" size={18} color="#fff" />
              <Text style={styles.textTombol}> Beli </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardProduct;

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
