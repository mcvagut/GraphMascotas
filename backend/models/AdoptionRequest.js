class AdoptionRequest {
  constructor(session) {
    this.session = session;
  }

  async solicitarAdopcion(usuario, mascotaId) {
    const result = await this.session.run(
      'MATCH (user:Usuario {usuario: $usuario}), (pet:Mascota {mascotaId: $mascotaId}) ' +
      'CREATE (user)-[:SOLICITA_ADOPTAR]->(pet) ' +
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