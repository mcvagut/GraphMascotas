class RescueOrganization {
    constructor(session) {
      this.session = session;
    }
  
    async createRescueOrganization(properties) {
      const result = await this.session.run('CREATE (org:OrganizacionRescate $properties) RETURN org', {
        properties,
      });
  
      return result.records[0].get('org').properties;
    }
  
    async findRescueOrganizationById(organizationId) {
      const result = await this.session.run('MATCH (org:OrganizacionRescate {id: $id}) RETURN org', {
        id: organizationId,
      });
  
      if (result.records.length === 0) {
        return null; // Organización de rescate no encontrada
      }
  
      return result.records[0].get('org').properties;
    }

    async findOnlyById(organizationId) {
      const result = await this.session.run('MATCH (org:OrganizacionRescate {id: $organizationId}) RETURN org.id AS organizationId', {
        organizationId,
      });
  
      if (result.records.length === 0) {
        return null; // Organización de rescate no encontrada
      }
  
      return result.records[0].get('organizationId');
    }
    
    async findAllRescueOrganizations() {
      const result = await this.session.run('MATCH (org:OrganizacionRescate) RETURN org');
    
      return result.records.map((record) => record.get('org').properties);
    }
    
    async updateRescueOrganization(organizationId, updatedProperties) {
      const result = await this.session.run(
        'MATCH (org:OrganizacionRescate {id: $id}) SET ' +
        Object.keys(updatedProperties).map(key => `org.${key} = $updatedProperties.${key}`).join(', ') +
        ' RETURN org',
        {
          id: organizationId,
          updatedProperties,
        }
      );
    
      return result.records[0].get('org').properties;
    }
    
  
    async deleteRescueOrganization(organizationId) {
      await this.session.run('MATCH (org:OrganizacionRescate {id: $id}) DETACH DELETE org', {
        id: organizationId,
      });
    }

    async addPetToAdoptionList(organizationId, uuid) {
      const transaction = this.session.beginTransaction();
      console.log("OrganizationUUID: ", organizationId)
      console.log("PetUUID: ", uuid)
      try{
        await transaction.run(
          'MATCH (pet:Mascota {id: $uuid}), (org:OrganizacionRescate {id: $organizationId}) CREATE (org)-[:PONE_EN_ADOPCION]->(pet)',
          {
            organizationId,
            uuid,
          }
        );
        await transaction.commit();
      }catch(error){
        await transaction.rollback();
        throw error;
      }
    }
  }
  
  export default RescueOrganization;
  