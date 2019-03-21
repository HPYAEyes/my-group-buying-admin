import request from '@/utils/request'

export function queryCityList() {
  return request.get('/geo/getAllCity')
}

export function queryAreaList(adcode) {
  return request.get(`/geo/getArea?adcode=${adcode}&subdistrict=1`)
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

export function removeProduct(id) {
  return request.delete('/product/deleteProduct', { data: { id } });
}

export function changeHot({
  id,
  type,
  hot
}) {
  return request.post('/product/setHot', {
    id,
    type,
    hot
  });
}

export function addProduct({
  name,
  type,
  cityCode,
  adcode,
  place,
  address,
  tel,
  officeHours,
  description,
  price,
  imgUrl,
  saleList
}) {
  return request.post('/product/addProduct', {
    name,
    type,
    cityCode,
    adcode,
    place,
    address,
    tel,
    officeHours,
    description,
    price,
    imgUrl,
    saleList
  }) 
}