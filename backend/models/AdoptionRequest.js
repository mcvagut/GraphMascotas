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
        // Crear la relación ADOPTÓ si la organización acepta
        await transaction.run(
          'MATCH (user:Usuario {usuario: $usuario}) ' +
          'MATCH (pet:Mascota {mascotaId: $mascotaId}) ' +
          'SET pet.estadoAdopcion = "Adoptado" ' +
          'MERGE (user)-[:ADOPTÓ]->(pet)',
          {
            usuario,
            mascotaId,
          }
        );      
        
      }
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  
  


}

export default AdoptionRequest;