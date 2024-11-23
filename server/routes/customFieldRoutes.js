import express from 'express';
import { getCusomFields, newCustomField, updateCustomField, deleteCustomField } from "../controllers/customFieldController.js";

const customFieldRouter = express.Router();

customFieldRouter.get('/custom-fields', getCusomFields);
customFieldRouter.post('/custom-fields', newCustomField);
customFieldRouter.put('/custom-fields/:id', updateCustomField);
customFieldRouter.delete('/custom-fields/:id', deleteCustomField);

export default customFieldRouter;