class Pet {
    constructor(session) {
      this.session = session;
    }
  
    async createPet(properties) {
      const result = await this.session.run('CREATE (pet:Mascota $properties) RETURN pet', {
        properties,
      });
  
      return result.records[0].get('pet').properties;
    }
  
    async findPetByUUID(uuid) {
      const result = await this.session.run('MATCH (pet:Mascota {id: $uuid}) RETURN pet', {
        uuid,
      });
    
      if (result.records.length === 0) {
        return null; // Mascota no encontrada
      }
    
      return result.records[0].get('pet').properties;
    }

    async findOnlyByUUID(uuid) {
      const result = await this.session.run('MATCH (pet:Mascota {id: $uuid}) RETURN pet.id AS uuid', {
        uuid,
      });
    
      if (result.records.length === 0) {
        return null; // Mascota no encontrada
      }
    
      return result.records[0].get('uuid');
    }
    
  
    async updatePet(uuid, updatedProperties) {
      const result = await this.session.run(
        'MATCH (pet:Mascota {id: $uuid}) SET ' +
        Object.keys(updatedProperties).map(key => `pet.${key} = $updatedProperties.${key}`).join(', ') +
        ' RETURN pet',
        {
          uuid,
          updatedProperties,
        }
      );
    
      if (result.records.length === 0) {
        return null; // Mascota no encontrada
      }
    
      return result.records[0].get('pet').properties;
    }
    
    
    
    
  
    async deletePet(petId) {
      await this.session.run('MATCH (pet:Mascota {id: $id}) DETACH DELETE pet', {
        id: petId,
      });
    }
  
    async assignToRescueOrganization(petId, organizationId) {
      await this.session.run(
        'MATCH (pet:Mascota {id: $petId}), (org:OrganizacionRescate {id: $organizationId}) ' +
        'CREATE (pet)-[:PERTENECE_A]->(org)',
        {
          petId,
          organizationId,
        }
      );
    }
  }
  
  export default Pet;
  