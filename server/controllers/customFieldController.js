import CustomField from "../models/customFieldModel.js";
import Request from "../models/requestModel.js";

export const getCusomFields = async (req, res) => {
    try {
    const customFields = await CustomField.find();
    res.status(200).json(customFields);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch custom fields" });
  }
};

export const newCustomField = async (req, res) => {
    try {
    const { label, fieldType, options, isRequired } = req.body;
    const newField = new CustomField({ label, fieldType, options, isRequired });
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ error: "Failed to add custom field" });
  }
};

export const updateCustomField = async(req, res) => {
    try {
    const { id } = req.params;
    const { label, fieldType, options, isRequired } = req.body;
    const updatedField = await CustomField.findByIdAndUpdate(
      id,
      { label, fieldType, options, isRequired },
      { new: true }
    );
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ error: "Failed to update custom field" });
  }
};

export const deleteCustomField = async(req, res) => {
    try {
    const { id } = req.params;

    const deletedField = await CustomField.findByIdAndDelete(id);

    if (!deletedField) {
      return res.status(404).json({ message: 'Field not found' });
    }

    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
