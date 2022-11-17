import Envelope from "./Envelope";

const Envelopes = ({ year, month, envelopes, deleteEnvelope }) => {
  return (
    <>
      {envelopes.map((envelope) => (
        <Envelope
          year={year}
          month={month}
          key={envelope._id}
          envelope={envelope}
          envelopes={envelopes}
          deleteEnvelope={deleteEnvelope}
        />
      ))}
    </>
  );
};

export default Envelopes;
