// server/controllers/analyticsController.js
import Student from '../models/studentModel.js';

export const getAnalytics = async (req, res) => {
  const totalStudents = await Student.countDocuments();
  // const totalRequests = await Request.countDocuments();

  res.json({
    totalStudents,
    // totalRequests,
  });
};
