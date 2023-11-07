import express from 'express';

import {
    createRescueOrganization,
    getRescueOrganizationByUUID,
    updateRescueOrganization,
    deleteRescueOrganizationByUUID,
    getAllRescueOrganizations,
    addPetToAdoptionList,
    } from '../controllers/rescueOrganization.js';

const router = express.Router();

router.post('/', createRescueOrganization);
router.get('/:organizationId', getRescueOrganizationByUUID);
router.get('/', getAllRescueOrganizations);
router.put('/:organizationId', updateRescueOrganization);
router.delete('/:organizationId', deleteRescueOrganizationByUUID);
router.post('/addToAdopt', addPetToAdoptionList);

export default router;