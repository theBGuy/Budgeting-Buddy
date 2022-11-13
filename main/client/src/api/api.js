import {instance as axios} from './axiosConfig';

class Api {
  async createYear(year) {
    const response = await axios.get("/years/createYear", year);
    return response.data;
  }

  async getYear(year) {
    const response = await axios.get(`years/${year}`);
    return response.data;
  }

  async getYears() {
    const response = await axios.get("/years");
    return response.data;
  }

  async editYear(data) {
    const response = await axios.patch("/years/editYear", data);
    return response.data;
  }

  async deleteYear(data) {
    const response = await axios.delete("/years/deleteYear", data);
    return response.data;
  }

  async getMonths(year) {
    const response = await axios.get(`/months/${year}`);
    return response.data;
  }

  async editMonth(data) {
    const response = await axios.patch("/months/editMonth", data);
    return response.data;
  }

  async createEnvelope(data) {
    const response = await axios.post("/envelopes/createEnvelope", data);
    return response.data;
  }

  async getEnvelopes(monthId) {
    const response = await axios.get(`/envelopes/${monthId}`);
    return response.data;
  }

  async getEnvelope(envelopeId) {
    const response = await axios.get(`/envelopes/${envelopeId}`);
    return response.data;
  }

  async editEnvelope(data) {
    // data: { monthIds, envelopeName, newEnvelope}
    const response = await axios.patch("/envelopes/updateEnvelope", data);
    return response.data;
  }

  async deleteEnvelope(envelopeId) {
    const response = await axios.delete("/envelopes/deleteEnvelope", {
      data: { envelopeId },
    });
    return response.data;
  }
}

const api = new Api();
export default api;
