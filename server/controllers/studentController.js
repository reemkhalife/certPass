// server/controllers/studentController.js
import Student from '../models/studentModel.js';

export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};
