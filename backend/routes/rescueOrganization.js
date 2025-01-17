import express from 'express';

import {
    createRescueOrganization,
    getRescueOrganizationByUUID,
    updateRescueOrganization,
    deleteRescueOrganizationByUUID,
    getAllRescueOrganizations,
    addPetToAdoptionList,
    gestionarSolicitudesAdopcion,
    registroOrganizacionRescate,
    getAllAdoptionRequestsByOrganization,
    } from '../controllers/rescueOrganization.js';

const router = express.Router();

router.post('/', createRescueOrganization);
router.get('/:organizationId', getRescueOrganizationByUUID);
router.get('/', getAllRescueOrganizations);
router.put('/:organizationId', updateRescueOrganization);
router.delete('/:organizationId', deleteRescueOrganizationByUUID);
router.post('/addToAdopt', addPetToAdoptionList);

router.get('/adopcion/obtener-solicitudes/:organizationId', getAllAdoptionRequestsByOrganization);

router.post('/adopcion/gestionar-solicitud', gestionarSolicitudesAdopcion);

router.post('/registroOrg',registroOrganizacionRescate)



export default router;