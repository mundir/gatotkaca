import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import {ribuan, toRB} from './Fungsi';
import Konstanta from './Konstanta';
import noImage from '../assets/noImage.jpg';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
const setengah = windowWidth / 2 - 2;

const CardAkan = props => {
  const data = props.data;
  const url =
    data.img === '' || data.img === null
      ? noImage
      : {
          uri: `${Konstanta.api.imgBarang}/${data.produk}/${data.img}`,
        };

  return (
    <View style={styles.cardProduct}>
      <View style={styles.cardProductBorder}>
        <TouchableOpacity
          style={styles.productImgWrap}
          onPress={props.onPressDetail}>
          <FastImage
            style={styles.productImg}
            source={url}
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
          <Text style={styles.teksterjual}>Jenis: {data.namaJenis}</Text>
          <View style={styles.rowBagikan}>
            <TouchableOpacity style={styles.btnWA} onPress={props.onPressChat}>
              <Text style={{color: 'green'}}>
                <Icon name="whatsapp" size={16} color="green" /> Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onPressShare}>
              <Text style={{color: Konstanta.warna.dua}}>
                <Icon name="share-alt" size={16} color={Konstanta.warna.dua} />{' '}
                Share
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.teksterjual}>
            Mulai {moment.utc(data.mulai).format('DD/MM/YY hh:mm A')}
          </Text>
          <Text style={styles.teksterjual}>
            Selesai {moment.utc(data.selesai).format('DD/MM/YY hh:mm A')}
          </Text>

          {/* <View style={styles.rowHarga}>
            {data.diskon !== 0 ? (
              <View>
                <Text style={styles.hargaLama}>{ribuan(harga)}</Text>
                <Text style={styles.teksterjual}>Disc {data.diskon}%</Text>
              </View>
            ) : null}
          </View> */}
          <View style={styles.kotakMargin}>
            <View style={styles.kotakHarga}>
              <Text style={{fontSize: 12}}>OPEN BID</Text>
              <Text style={styles.hargaBaru}>{ribuan(data.openBid)}</Text>
            </View>
          </View>
          <View style={styles.wadahTombolBawah}>
            {/* <TouchableOpacity
              style={[styles.tombol, styles.tDetail]}
              onPress={data.onPressDetail}>
              <Icon name="book" size={18} color="#fff" />
              <Text style={styles.textTombol}> Detail </Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={[styles.tombol, styles.btnBeli]}
              onPress={props.onPressBeli}>
              <Icon name="bitcoin" size={18} color="white" />
              <Text style={styles.tBeli}> BID </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardAkan;

const styles = StyleSheet.create({
  cardProduct: {
    width: setengah,
    padding: 5,
  },
  cardProductBorder: {
    borderWidth: 0.6,
    borderColor: Konstanta.warna.disabled,
    borderRadius: 10,
    padding: 5,
  },
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
  btnBeli: {
    backgroundColor: Konstanta.warna.satu,
  },
  tBeli: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  textTombol: {color: 'white'},
  teksProduct: {
    color: Konstanta.warna.satu,
    minHeight: 37,
    textAlign: 'justify',
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
  kotakMargin: {flex: 1},
  kotakHarga: {
    padding: 2,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: Konstanta.warna.dua,
  },
  warnaSatu: {color: Konstanta.warna.satu},
});
