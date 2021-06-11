import Share from 'react-native-share';

export default function Bagikan(d) {
  //   const url = Konstanta.api.`https://vmstore.web.id/barang/${d.id}`;
  let shareOptions = {
    title: 'JAWA KOI CENTER',
    // url: url,
    message: d.pesan,
    subject: d.subjek,
  };

  Share.open(shareOptions)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      err && console.log(err);
    });
}
