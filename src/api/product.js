import request from '@/utils/request'

export function queryCityList() {
  return request.get('/geo/getAllCity')
}

export function queryTypeList() {
  return request.get('/product/getTypeList');
}

export function queryProductList({
  pageSize,
  pageNum,
  cityCode,
  sort,
  adcode,
  type,
  street
}) {
  let query = `pageSize=${pageSize}&pageNum=${pageNum}&cityCode=${cityCode}&sort=${sort}`;
  if (adcode) {
    query += `&adcode=${adcode}`;
  }
  if (type) {
    query += `&type=${type}`;
  }
  if(street) {
    query += `&street=${street}`;
  }
  return request.get(`/product/getProductList?${query}`);
}