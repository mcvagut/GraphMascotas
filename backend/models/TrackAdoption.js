class TrackAdoption {
  constructor(session) {
    this.session = session;
  }
  async createAdoptionTracking(usuario, mascotaId, organizationId, date) {
    const result = await this.session.run(
      `
          MATCH (user:Usuario {usuario: $usuario}),
          (pet:Mascota {mascotaId: $mascotaId}),
          (organization:OrganizacionRescate {organizationId: $organizationId})
    
    CREATE (tracking:SeguimientoAdopcion {fechaInicio: $date, fotos: [], comentariosOrganizacion: [], valoracionesOrganizacion: [], comentariosUsuario: [], valoracionesUsuario: []})
    CREATE (user)-[:HA_ACEPTADO_SEGUIR]->(tracking)
    CREATE (organization)-[:REALIZA_SEGUIMIENTO]->(tracking)
    CREATE (pet)-[:SEGUIDA]->(tracking)
    
    RETURN tracking
          `,
      {
        usuario,
        mascotaId,
        organizationId,
        date,
      }
    );

    return result.records[0].get("tracking").properties;
  }
}

export default TrackAdoption;
