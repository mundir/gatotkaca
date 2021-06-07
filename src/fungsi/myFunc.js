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
