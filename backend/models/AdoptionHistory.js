class AdoptionHistory {
    constructor(session) {
      this.session = session;
    }
  
    async createAdoptionHistory(properties) {
      const result = await this.session.run('CREATE (history:HistorialAdopciones $properties) RETURN history', {
        properties,
      });
  
      return result.records[0].get('history').properties;
    }
  
    async findAdoptionHistoryById(historyId) {
      const result = await this.session.run('MATCH (history:HistorialAdopciones {id: $id}) RETURN history', {
        id: historyId,
      });
  
      if (result.records.length === 0) {
        return null; // Historial de adopciones no encontrado
      }
  
      return result.records[0].get('history').properties;
    }
  
    async updateAdoptionHistory(historyId, updatedProperties) {
      const result = await this.session.run(
        'MATCH (history:HistorialAdopciones {id: $id}) SET history = $updatedProperties RETURN history',
        {
          id: historyId,
          updatedProperties,
        }
      );
  
      return result.records[0].get('history').properties;
    }
  
    async deleteAdoptionHistory(historyId) {
      await this.session.run('MATCH (history:HistorialAdopciones {id: $id}) DETACH DELETE history', {
        id: historyId,
      });
    }
  
    async createAdoptionRecord(userId, petId, date, description) {
      const result = await this.session.run(
        'MATCH (user:Usuario {id: $userId}), (pet:Mascota {id: $petId}) ' +
        'CREATE (user)-[:ADOPTO {fecha: $date, descripcion: $description}]->(history:HistorialAdopciones) ' +
        'CREATE (history)-[:ES_PARA]->(pet) ' +
        'RETURN history',
        {
          userId,
          petId,
          date,
          description,
        }
      );
  
      return result.records[0].get('history').properties;
    }
  }
  
  export default AdoptionHistory;
  