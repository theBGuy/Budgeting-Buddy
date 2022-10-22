const newEnvelope = (req, res, next) => {
    res.json({message: "Post new Envelope"});
};

const getEnvelope = (req, res, next) => {
    res.json({message: "Get envelope data"});
};

module.exports = { newEnvelope, getEnvelope };