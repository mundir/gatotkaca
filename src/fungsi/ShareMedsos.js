import Share from 'react-native-share';
import {ribuan} from './Library';

export default function ShareMedsos(d) {
  const harga = d.harga;
  const diskon = Math.floor((d.diskon / 100) * harga);
  const url = `https://vmstore.web.id/barang/${d.id}`;
  let shareOptions = {
    title: 'VMStore - Smart Home Shopping',
    url: url,
    message: `Dapatkan ${d.nama} harga Rp${ribuan(
      harga - diskon,
    )} di aplikasi VMStore`,
    subject: `${d.nama}`,
  };

  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
}
