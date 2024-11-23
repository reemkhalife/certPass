import express from 'express';
import { getOrganizations } from "../controllers/organizationController.js";

const organizationRouter = express.Router();

organizationRouter.get('/organizations', getOrganizations);

export default organizationRouter;