class AdoptionRequest {
    constructor(session) {
      this.session = session;
    }
  
    async createAdoptionRequest(properties) {
      const result = await this.session.run('CREATE (request:SolicitudAdopcion $properties) RETURN request', {
        properties,
      });
  
      return result.records[0].get('request').properties;
    }
  
    async findAdoptionRequestById(requestId) {
      const result = await this.session.run('MATCH (request:SolicitudAdopcion {id: $id}) RETURN request', {
        id: requestId,
      });
  
      if (result.records.length === 0) {
        return null; // Solicitud de adopción no encontrada
      }
  
      return result.records[0].get('request').properties;
    }
  
    async updateAdoptionRequest(requestId, updatedProperties) {
      const result = await this.session.run(
        'MATCH (request:SolicitudAdopcion {id: $id}) SET request = $updatedProperties RETURN request',
        {
          id: requestId,
          updatedProperties,
        }
      );
  
      return result.records[0].get('request').properties;
    }
  
    async deleteAdoptionRequest(requestId) {
      await this.session.run('MATCH (request:SolicitudAdopcion {id: $id}) DETACH DELETE request', {
        id: requestId,
      });
    }
  
    async userSendsAdoptionRequest(userId, petId, description) {
      const result = await this.session.run(
        'MATCH (user:Usuario {id: $userId}), (pet:Mascota {id: $petId}) ' +
        'CREATE (user)-[:ENVIO_SOLICITUD]->(request:SolicitudAdopcion {descripcion: $description})-[:ES_PARA]->(pet) ' +
        'RETURN request',
        {
          userId,
          petId,
          description,
        }
      );
  
      return result.records[0].get('request').properties;
    }
  }
  
  export default AdoptionRequest;
  