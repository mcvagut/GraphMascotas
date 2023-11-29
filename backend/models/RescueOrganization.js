import { v4 as uuidv4 } from 'uuid';
class RescueOrganization {
  constructor(session) {
    this.session = session;
  }

  async verificarCredenciales(usuario, password) {
    const result = await this.session.run(
      'MATCH (org:OrganizacionRescate {usuario: $usuario, password: $password}) RETURN org',
      {
        usuario,
        password,
      }
    );
  
    if (result.records.length > 0) {
      return result.records[0].get('org').properties;
    } else {
      return null;
    }
  }
  

  async createRescueOrganization(properties) {
    const result = await this.session.run(
      "CREATE (org:OrganizacionRescate $properties) RETURN org",
      {
        properties,
        isOrganization: true,
        isAdmin: false,
      }
    );

    return result.records[0].get("org").properties;
  }

  async findRescueOrganizationById(organizationId) {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate {organizationId: $organizationId}) RETURN org",
      {
        organizationId: organizationId,
      }
    );

    if (result.records.length === 0) {
      return null; // Organización de rescate no encontrada
    }

    return result.records[0].get("org").properties;
  }

  async findRescueOrganizationByUser(email,usuario) {
    const result = await this.session.run(
      "MATCH (org:OrganizacionRescate {email: $email, usuario: $usuario}) RETURN org",
      {
        email,
        usuario,
      }
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("org").properties;
  }

  async crearOrg({nombre, email, usuario, password, ciudad, descripcion, calle, telefono, isOrganization, isAdmin}) {  
    const organizationId = uuidv4();
    await this.session.run(
      "CREATE (org:OrganizacionRescate {organizationId: $organizationId, nombre: $nombre, email: $email, usuario: $usuario, password: $password, telefono: $telefono, calle: $calle, ciudad:$ciudad,  descripcion: $descripcion, isOrganization: $isOrganization, isAdmin: $isAdmin}) RETURN org",
      {
        organizationId,
        nombre,
        email,
        usuario,
        password,
        telefono,
        descripcion,
        ciudad,
        calle,
        telefono,
        isOrganization: true,
        isAdmin: false,
      }
    );
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
      "MATCH (org:OrganizacionRescate {organizationId: $organizationId}) DETACH DELETE org",
      {
        organizationId: organizationId,
      }
    );
  }

  // En tu modelo RescueOrganization.js
  async agregarMascota(orgNode, petNode) {
    const transaction = this.session.beginTransaction();
    //console.log("PetNode: ", petNode);
    //console.log("OrgNode: ", orgNode);

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
    // console.log("OrganizationUUID: ", organizationId);
    // console.log("PetUUID: ", uuid);
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
}

export default RescueOrganization;
