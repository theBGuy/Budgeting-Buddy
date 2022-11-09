const newEnvelope = (req, res) => {
  res.json({ message: 'Post new Envelope' });
};

const getEnvelope = (req, res) => {
  res.json({ message: 'Get envelope data' });
};

module.exports = { newEnvelope, getEnvelope };
