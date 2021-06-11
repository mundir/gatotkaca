import moment from 'moment';

export function ribuan(x) {
  if (x > 0) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return x;
}

export function toRB(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'RB+'
    : Math.sign(num) * Math.abs(num);
}

export function acak(x) {
  const rdm = Math.random().toString(10).substr(2, x);
  return rdm;
}

export function generateid(awalan, n = 4) {
  var now = moment().format('YYMMDD');
  const rdm = Math.random().toString(10).substr(2, n);
  return awalan + now + rdm;
}

export function tunggu(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
