import { useState, useEffect } from "react";
import Envelope from "./Envelope";
import api from "../../api/api";

const Envelopes = ({ monthId }) => {
  const [envelopes, setEnvelopes] = useState([]);

  async function getEnvelopes(monthId) {
    const envelopes = await api.getEnvelopes(monthId);
    setEnvelopes(envelopes);
  }

  async function deleteEnvelope(envelopeId) {
    const { success } = await api.deleteEnvelope(envelopeId);
    if (success) {
      setEnvelopes((prev) => prev.filter((envelope) => envelope._id !== envelopeId));
    }
  }

  useEffect(() => {
    getEnvelopes(monthId);
  }, [monthId]);

  return (
    <>
      {envelopes.map((envelope) => (
        <Envelope
          key={envelope._id}
          envelope={envelope}
          deleteEnvelope={deleteEnvelope}
        />
      ))}
    </>
  );
};

export default Envelopes;
