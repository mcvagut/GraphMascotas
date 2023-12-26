class AdoptionRequest {
  constructor(session) {
    this.session = session;
  }
  async verificarSolicitudPendiente(usuario, mascotaId) {
    const result = await this.session.run(
      "MATCH (user:Usuario {usuario: $usuario})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {mascotaId: $mascotaId}) " +
        'WHERE pet.estadoAdopcion = "Pendiente" ' +
        "RETURN r",
      {
        usuario,
        mascotaId,
      }
    );

    return result.records.length > 0 ? result.records[0].get("r") : null;
  }

  async verificarMascotaAdoptada(mascotaId) {
    const result = await this.session.run(
      "MATCH (pet:Mascota {mascotaId: $mascotaId}) " +
        'WHERE pet.estadoAdopcion = "Adoptado" ' +
        "RETURN pet",
      {
        mascotaId,
      }
    );

    return result.records.length > 0;
  }

  async solicitarAdopcion(usuario, mascotaId) {
    const result = await this.session.run(
      "MATCH (user:Usuario {usuario: $usuario}), (pet:Mascota {mascotaId: $mascotaId}) " +
        "CREATE (user)-[:SOLICITA_ADOPTAR]->(pet) " +
        'SET pet.estadoAdopcion = "Pendiente" ' +
        "RETURN user.usuario, pet.mascotaId",
      {
        usuario,
        mascotaId,
      }
    );

    return {
      usuario: result.records[0].get("user.usuario"),
      mascotaId: result.records[0].get("pet.mascotaId"),
    };
  }

  async gestionarSolicitudAdopcion(usuario, mascotaId, aceptar) {
    const transaction = this.session.beginTransaction();

    try {
      // Eliminar la solicitud de adopción
      await transaction.run(
        "MATCH (user:Usuario {usuario: $usuario})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {mascotaId: $mascotaId}) " +
          "DELETE r",
        {
          usuario,
          mascotaId,
        }
      );

      if (aceptar) {
        const fechaAdopcion = new Date().toISOString();
        // Crear la relación ADOPTÓ si la organización acepta
        await transaction.run(
          "MATCH (user:Usuario {usuario: $usuario}) " +
            "MATCH (pet:Mascota {mascotaId: $mascotaId}) " +
            'SET pet.estadoAdopcion = "Adoptado", pet.fechaAdopcion = $fechaAdopcion ' +
            "MERGE (user)-[:ADOPTÓ]->(pet)",
          {
            usuario,
            mascotaId,
            fechaAdopcion,
          }
        );
      } else {
        // Agregar lógica específica para el caso de rechazo si es necesario
        const fechaRechazo = new Date().toISOString();

        await transaction.run(
            'CREATE (historial:HistorialRechazos { usuario: $usuario, mascotaId: $mascotaId, estadoAdopcion: "Rechazado", fechaRechazo: $fechaRechazo }) ' +
            'WITH historial ' +
            'MATCH (pet:Mascota {mascotaId: $mascotaId}) ' +
            'MATCH (user:Usuario {usuario: $usuario}) ' +
            'MERGE (historial)-[:RECHAZÓ]->(pet) ' +
            'MERGE (historial)-[:RECHAZADO]->(user)',
            {
                usuario,
                mascotaId,
                fechaRechazo,
            }
        );

        console.log(`La solicitud de ${usuario} para adoptar la mascota ${mascotaId} ha sido rechazada.`);
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
        "RETURN user.usuario, pet.mascotaId",
      {
        organizationId,
      }
    );

    return result.records.map((record) => ({
      usuario: record.get("user.usuario"),
      mascotaId: record.get("pet.mascotaId"),
    }));
  }

  async obtenerPendientesPorUsuario(usuario) {
    const result = await this.session.run(
      "MATCH (user:Usuario {usuario: $usuario})-[:SOLICITA_ADOPTAR]->(pet:Mascota)" +
        'WHERE pet.estadoAdopcion = "Pendiente" ' +
        "RETURN pet",
      {
        usuario,
      }
    );
    return result.records.map((record) => ({
      mascota: record.get("pet"),
    }));
  }

  async obtenerAdopcionesPorUsuario(usuario) {
    const result = await this.session.run(
      "MATCH (user:Usuario {usuario: $usuario})-[:ADOPTÓ]->(pet:Mascota)" +
        "RETURN pet",
      {
        usuario,
      }
    );
    return result.records.map((record) => ({
      mascota: record.get("pet"),
    }));
  }
  async obtenerRechazadosPorUsuario(usuario) {
    try {
      const result = await this.session.run(
        'MATCH (historial:HistorialRechazos)-[:RECHAZADO]->(user:Usuario {usuario: $usuario}) RETURN historial',
        {
          usuario,
        }
      );
  
      const rechazados = result.records.map(record => ({
        historial: record.get('historial').properties,
      }));
  
      return rechazados;
    } catch (error) {
      console.error('Error al obtener mascotas rechazadas:', error);
      throw error;
    }
  }  
}
export default AdoptionRequest;
