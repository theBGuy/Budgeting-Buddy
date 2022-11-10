import {instance as axios} from './axiosConfig';

class Api {
  async createYear(year) {
    const response = await axios.get('/years/create', year);
    return response.data;
  }

  async editYear(year, data) {
    // data: { new year data }
    const response = await axios.patch(`/years/edit/${year}`, data);
    return response.data;
  }

  async deleteYear(year) {
    const response = await axios.delete(`/years/delete/${year}`);
    return response.data;
  }

  async getYears() {
    const response = await axios.get('/years/all');
    return response.data;
  }

  async editMonth(monthId, data) {
    // data: {new month data}
    const response = await axios.patch(`/months/edit/${monthId}`, data);
    return response.data;
  }

  async createEnvelope(data) {
    const response = await axios.post(`/envelopes/create`);
    return response.data;
  }

  async editEnvelope(envelopeName, data) {
    // data: { year, months selected, new envelope data}
    const response = await axios.patch(`/envelopes/edit/${envelopeName}`, data);
    return response.data;
  }

  async deleteEnvelope(envelopeId) {
    const response = await axios.delete(`/envelopes/delete/${envelopeId}`);
    return response.data;
  }

  async getEnvelopes(monthId) {
    // route could be different maybe...
    const response = await axios.get(`/months/${monthId}/envelopes`);
    return response.data;
  }
}

const api = new Api()
export default api