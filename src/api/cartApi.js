import axios from "axios/index";

const cartApi = {
  async get(sessionId, businessId) {
    return await axios.get(process.env.REACT_APP_API_ACCESS + '/api/cart/' + sessionId + '/' + businessId);
  },

  async put(sessionId, cart, businessId) {
    return await axios.put(process.env.REACT_APP_API_ACCESS + '/api/cart/' + sessionId+ '/' + businessId, { productList: cart })
  }
}

export default cartApi