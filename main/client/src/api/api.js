import { instance as axios } from './axiosConfig';

class Api {
  async createYear(data) {
    const response = await axios.post("/years/createYear", data);
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

  async updateYear(data) {
    const response = await axios.patch(`/years/updateYear/${data.year}`, data);
    return response.data;
  }

  async deleteYear(year) {
    const response = await axios.delete(`/years/${year}`, {
      data: { year },
    });
    return response.data;
  }

  async getMonths(year) {
    const response = await axios.get(`/months/${year}`);
    return response.data;
  }

  async updateMonth(data) {
    const response = await axios.patch("/months/updateMonth", data);
    return response.data;
  }

  async createEnvelope(envelopeData) {
    const response = await axios.post(
      "/envelopes/createEnvelope",
      envelopeData
    );
    return response.data;
  }

  async getEnvelopes(monthId) {
    const response = await axios.get(`/envelopes/by-monthId/${monthId}`);
    return response.data;
  }

  async getEnvelopesByCategory(category) {
    const response = await axios.get(`/envelopes/by-category/${category}`);
    return response.data;
  }

  async getEnvelope(envelopeId) {
    const response = await axios.get(`/envelopes/by-id/${envelopeId}`);
    return response.data;
  }

  async updateEnvelope(envelopeData) {
    const response = await axios.patch(
      `/envelopes/by-id/${envelopeData._id}`,
      envelopeData
    );
    return response.data;
  }

  async updateEnvelopes(envelopeData) {
    const response = await axios.patch(
      "/envelopes/updateEnvelopes",
      envelopeData
    );
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
