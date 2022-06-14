import axios from "axios/index";

const orderApi = {
  async post(id, sessionId, businessId) {

    console.log('abc',id,sessionId);
    return await axios.post(process.env.REACT_APP_API_ACCESS + '/api/order/' + sessionId + '/' + businessId, {
      id
    });
  },

}

export default orderApi