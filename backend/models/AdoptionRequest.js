class AdoptionRequest {
  constructor(session) {
    this.session = session;
  }
  async verificarSolicitudPendiente(usuario, mascotaId) {
    const result = await this.session.run(
      'MATCH (user:Usuario {usuario: $usuario})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {mascotaId: $mascotaId}) ' +
      'WHERE pet.estadoAdopcion = "Pendiente" ' +
      'RETURN r',
      {
        usuario,
        mascotaId,
      }
    );
  
    return result.records.length > 0 ? result.records[0].get('r') : null;
  }
  
  async verificarMascotaAdoptada(mascotaId) {
    const result = await this.session.run(
      'MATCH (pet:Mascota {mascotaId: $mascotaId}) ' +
      'WHERE pet.estadoAdopcion = "Adoptado" ' +
      'RETURN pet',
      {
        mascotaId,
      }
    );
  
    return result.records.length > 0;
  }

  async solicitarAdopcion(usuario, mascotaId) {
    const result = await this.session.run(
      'MATCH (user:Usuario {usuario: $usuario}), (pet:Mascota {mascotaId: $mascotaId}) ' +
      'CREATE (user)-[:SOLICITA_ADOPTAR]->(pet) ' +
      'SET pet.estadoAdopcion = "Pendiente" ' +
      'RETURN user.usuario, pet.mascotaId',
      {
        usuario,
        mascotaId,
      }
    );

    return {
      usuario: result.records[0].get('user.usuario'),
      mascotaId: result.records[0].get('pet.mascotaId'),
    };
  }

  async gestionarSolicitudAdopcion(usuario, mascotaId, aceptar) {
    const transaction = this.session.beginTransaction();
  
    try {
      // Eliminar la solicitud de adopción
      await transaction.run(
        'MATCH (user:Usuario {usuario: $usuario})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {mascotaId: $mascotaId}) ' +
        'DELETE r',
        {
          usuario,
          mascotaId,
        }
      );
  
      if (aceptar) {
        const fechaAdopcion = new Date().toISOString();
        // Crear la relación ADOPTÓ si la organización acepta
        await transaction.run(
          'MATCH (user:Usuario {usuario: $usuario}) ' +
          'MATCH (pet:Mascota {mascotaId: $mascotaId}) ' +
          'SET pet.estadoAdopcion = "Adoptado", pet.fechaAdopcion = $fechaAdopcion ' +
          'MERGE (user)-[:ADOPTÓ]->(pet)',
          {
            usuario,
            mascotaId,
            fechaAdopcion
          }
        );      
        
      }
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAllAdoptionRequestsByOrganization(organizationId) {
    const result = await this.session.run(
      'MATCH (user:Usuario)-[:SOLICITA_ADOPTAR]->(pet:Mascota {estadoAdopcion: "Pendiente", organizationId: $organizationId}) ' +
      'RETURN user.usuario, pet.mascotaId',
      {
        organizationId,
      }
    );
  
    return result.records.map((record) => ({
      usuario: record.get('user.usuario'),
      mascotaId: record.get('pet.mascotaId'),
    }));
  }

}

export default AdoptionRequest;