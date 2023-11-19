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
    // En tu modelo Pet.js
async findPetByInfo({ nombre, categoria, edad, sexo, color, tamaño, ubicacion }) {
  const transaction = this.session.beginTransaction();

  try {
    const result = await transaction.run(
      'MATCH (m:Mascota) WHERE ' +
      'm.nombre = $nombre AND ' +
      'm.categoria = $categoria AND ' +
      'm.edad = $edad AND ' +
      'm.sexo = $sexo AND ' +
      'm.color = $color AND ' +
      'm.tamaño = $tamaño AND ' +
      'm.ubicacion = $ubicacion ' +
      'RETURN m',
      {
        nombre,
        categoria,
        edad,
        sexo,
        color,
        tamaño,
        ubicacion
      }
    );

    await transaction.commit();

    if (result.records.length > 0) {
      // Devuelve la primera mascota encontrada
      return result.records[0].get('m').properties;
    } else {
      return null;
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

  
    async findPetByUUID(uuid) {
      const result = await this.session.run('MATCH (pet:Mascota {mascotaId: $uuid}) RETURN pet', {
        uuid,
      });
    
      if (result.records.length === 0) {
        return null; // Mascota no encontrada
      }
    
      return result.records[0].get('pet').properties;
    }

    // async findOnlyByUUID(uuid) {
    //   const result = await this.session.run('MATCH (pet:Mascota {id: $uuid}) RETURN pet.id AS uuid', {
    //     uuid,
    //   });
    
    //   if (result.records.length === 0) {
    //     return null; // Mascota no encontrada
    //   }
    
    //   return result.records[0].get('uuid');
    // }

    async findOnlyByUUID(uuid) {
      const result = await this.session.run(
          'MATCH (pet:Mascota {mascotaId: $uuid}) RETURN pet',
          {
              uuid,
          }
      );
  
      if (result.records.length > 0) {
          return result.records[0].get('pet');
      } else {
          return null;
      }
  }

  async findOrganizationIdByUUID(uuid) {
    const result = await this.session.run(
        'MATCH (pet:Mascota {mascotaId: $uuid}) RETURN pet',
        {
            uuid,
        }
    );

    if (result.records.length > 0) {
      const mascota = result.records[0].get('pet').properties;
      return mascota;    
    } else {
        return null;
    }
}

    
  
    async updatePet(uuid, updatedProperties) {
      const result = await this.session.run(
        'MATCH (pet:Mascota {mascotaId: $uuid}) SET ' +
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
      await this.session.run('MATCH (pet:Mascota {mascotaId: $id}) DETACH DELETE pet', {
        id: petId,
      });
    }

    async updatePetAdoptionStatus(uuid, newStatus) {
      const transaction = this.session.beginTransaction();
  
      try {
        await transaction.run(
          'MATCH (pet:Mascota {mascotaId: $uuid}) SET pet.estadoAdopcion = $newStatus',
          {
            uuid,
            newStatus,
          }
        );
  
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
    async assignToRescueOrganization(petId, organizationId) {
      await this.session.run(
        'MATCH (pet:Mascota {mascotaId: $petId}), (org:OrganizacionRescate {id: $organizationId}) ' +
        'CREATE (pet)-[:PERTENECE_A]->(org)',
        {
          petId,
          organizationId,
        }
      );
    }
  }
  
  export default Pet;
  