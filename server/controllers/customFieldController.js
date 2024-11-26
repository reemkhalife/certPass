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

// export const updateCustomField = async(req, res) => {
//     try {
//     const { id } = req.params;
//     const { label, fieldType, options, isRequired } = req.body;
//     const updatedField = await CustomField.findByIdAndUpdate(
//       id,
//       { label, fieldType, options, isRequired },
//       { new: true }
//     );
//     res.status(200).json(updatedField);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update custom field" });
//   }
// };

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
};

export const updateCustomField = async (req, res) => {
  try {
    const { fieldId, isRequired } = req.body;
    const updatedField = await CustomField.findByIdAndUpdate(
      fieldId,
      { isRequired },
      { new: true }
    );
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ message: "Failed to update custom field." });
  }
};

export const saveCustomFields = async (req, res) => {
  const { customFields, fieldsToRemove  } = req.body;

  console.log(customFields);

  if (!Array.isArray(customFields) || !Array.isArray(fieldsToRemove)) {
    return res.status(400).json({ message: 'Invalid input format' });
  }

  try {
    // Iterate through custom fields and update, add, or remove as necessary
    const promises = customFields.map(async (field) => {
      if (field._id) {
        // Update existing field
        return await CustomField.findByIdAndUpdate(field._id, {...field}, { new: true });
      } else {
        // Add new field
        const newField = new CustomField(field);
        return await newField.save();
      }
    });

    // Execute all updates/additions
    const updatedFields = await Promise.all(promises);

    // Find and remove any fields not included in the `customFields` array
    // const updatedFieldIds = customFields.map((field) => field._id).filter(Boolean);
    // await CustomField.deleteMany({ _id: { $nin: updatedFieldIds } });
    
    // Remove fields explicitly marked for deletion
    if (fieldsToRemove.length > 0) {
      await CustomField.deleteMany({ _id: { $in: fieldsToRemove } });
    }

    return res.status(200).json({
      message: 'Custom fields saved successfully',
      data: updatedFields || [],
    });
  } catch (error) {
    console.error('Error saving custom fields:', error);
    return res.status(500).json({ message: 'Failed to save custom fields', error });
  }
};