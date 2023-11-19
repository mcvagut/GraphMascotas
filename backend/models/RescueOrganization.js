class RescueOrganization {
  constructor(session) {
    this.session = session;
  }

  async createRescueOrganization(properties) {
    const result = await this.session.run(
      "CREATE (org:OrganizacionRescate $properties) RETURN org",
      {
        properties,
      }
    );

    return result.records[0].get("org").properties;
  }

  async findRescueOrganizationById(id) {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate {organizationId: $id}) RETURN org",
      {
        organizationId: id,
      }
    );

    if (result.records.length === 0) {
      return null; // Organización de rescate no encontrada
    }

    return result.records[0].get("org").properties;
  }

  async findOnlyById(id) {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate {organizationId: $id}) RETURN org",
      {
        id,
      }
    );

    if (result.records.length === 0) {
      return null; // Organización de rescate no encontrada
    }

    return result.records[0].get("org");
  }

  async findAllRescueOrganizations() {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate) RETURN org"
    );

    return result.records.map((record) => record.get("org").properties);
  }

  async updateRescueOrganization(id, updatedProperties) {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate {id: $id}) SET " +
        Object.keys(updatedProperties)
          .map((key) => `org.${key} = $updatedProperties.${key}`)
          .join(", ") +
        " RETURN org",
      {
        organizationId: id,
        updatedProperties,
      }
    );

    return result.records[0].get("org").properties;
  }

  async deleteRescueOrganization(organizationId) {
    await this.session.run(
      "MATCH (org:OrganizacionRescate {organizationId: $id}) DETACH DELETE org",
      {
        organizationId: organizationId,
      }
    );
  }

  // En tu modelo RescueOrganization.js
  async agregarMascota(orgNode, petNode) {
    const transaction = this.session.beginTransaction();
    console.log("PetNode: ", petNode);
    console.log("OrgNode: ", orgNode);

    try {
      await transaction.run(
        "MATCH (org:OrganizacionRescate {organizationId: $organizationId}), (pet:Mascota {mascotaId: $mascotaId}) " +
          "CREATE (org)-[:PONE_EN_ADOPCION]->(pet)",
        {
          organizationId: orgNode.properties.organizationId,
          mascotaId: petNode,
        }
      );

      // También puedes crear la relación PONE_EN_ADOPCION aquí si lo deseas

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async addPetToAdoptionList(organizationId, uuid) {
    const transaction = this.session.beginTransaction();
    console.log("OrganizationUUID: ", organizationId);
    console.log("PetUUID: ", uuid);
    try {
      await transaction.run(
        "MATCH (pet:Mascota {mascotaId: $uuid}), (org:OrganizacionRescate {organizationId: $organizationId}) CREATE (org)-[:PONE_EN_ADOPCION]->(pet)",
        {
          organizationId,
          uuid,
        }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async gestionarSolicitudesAdopcion(petNode, userNode) {
    try {
      // Crear una solicitud de adopción
      const solicitud = await this.adoptionRequest.createAdoptionRequest({
        petId: petNode.properties.id,
        userId: userNode.properties.id,
        estado: "Pendiente", // Puedes ajustar el estado según tu lógica
      });

      // Lógica adicional según necesidades específicas
    } catch (error) {
      console.error(error);
      throw new Error("Error al gestionar la solicitud de adopción");
    }
  }
}

export default RescueOrganization;
