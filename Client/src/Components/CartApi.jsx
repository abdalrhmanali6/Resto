import Api from "./Api";


export const getCart = (userId,token) =>

  Api.get(`/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCartItem = ( userId,productId, quantity, token) =>
  Api.post(
    `/cart/${userId}`,
    { product_id: productId, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );


export const deleteCartItem = (userId, productId, quantity, token) =>
  Api.delete(`/cart/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { product_id: productId, quantity }, // body goes here
  });

  