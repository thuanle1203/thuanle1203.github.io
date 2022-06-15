import axios from "axios/index";

const orderApi = {
  async post(payment, sessionId, businessId) {

    console.log('abc' ,sessionId);
    return await axios.post(process.env.REACT_APP_API_ACCESS + '/api/order/' + sessionId + '/' + businessId, payment);
  },

}

export default orderApi