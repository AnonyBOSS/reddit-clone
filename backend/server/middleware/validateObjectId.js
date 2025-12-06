const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const objectId = req.params[paramName];
  if (!objectId || !mongoose.Types.ObjectId.isValid(objectId)) {
    return res.status(400).json({ success: false, data: null, error: `Invalid ${paramName} format` });
  }
  next();
};

module.exports = validateObjectId;
