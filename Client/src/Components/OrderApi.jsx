import Api from "./Api";

export const placeOrder = (userId, location, token) =>
  Api.post(
    `/order/${userId}`,
    { location },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getUserOrders = (userId, token) =>
  Api.get(`/order/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });