module.exports = {
    successData: (res, message, data = {}) => {
      return res.status(200).json({ success: true, message, data });
    },
  
    badRequest: (res, message) => {
      return res.status(400).json({ success: false, message });
    },
  
    serverError: (res, message) => {
      return res.status(500).json({ success: false, message });
    }
  };
  