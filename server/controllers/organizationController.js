import Organization from "../models/organizationModel.js";

export const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json(organizations);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch organizations." });
    }
};