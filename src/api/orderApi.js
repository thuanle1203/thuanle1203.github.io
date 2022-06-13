import axios from "axios/index";

const orderApi = {
  async post(id, sessionId) {

    console.log('abc',id,sessionId);
    return await axios.post(process.env.REACT_APP_API_ACCESS + '/api/order/' + sessionId + '/' + process.env.REACT_APP_BUSINESS_ID, {
      id
    });
  },

}

export default orderApi