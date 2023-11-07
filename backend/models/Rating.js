class Rating {
    constructor(session) {
      this.session = session;
    }
  
    async createRating(properties) {
      const result = await this.session.run('CREATE (rating:Valoracion $properties) RETURN rating', {
        properties,
      });
  
      return result.records[0].get('rating').properties;
    }
  
    async findRatingById(ratingId) {
      const result = await this.session.run('MATCH (rating:Valoracion {id: $id}) RETURN rating', {
        id: ratingId,
      });
  
      if (result.records.length === 0) {
        return null; // Valoración no encontrada
      }
  
      return result.records[0].get('rating').properties;
    }
  
    async updateRating(ratingId, updatedProperties) {
      const result = await this.session.run(
        'MATCH (rating:Valoracion {id: $id}) SET rating = $updatedProperties RETURN rating',
        {
          id: ratingId,
          updatedProperties,
        }
      );
  
      return result.records[0].get('rating').properties;
    }
  
    async deleteRating(ratingId) {
      await this.session.run('MATCH (rating:Valoracion {id: $id}) DETACH DELETE rating', {
        id: ratingId,
      });
    }
  
    async userRates(targetId, userId, score, comment) {
      const result = await this.session.run(
        'MATCH (user:Usuario {id: $userId}), (target:Usuario {id: $targetId}) ' +
        'CREATE (user)-[:CALIFICO {puntuacion: $score, comentario: $comment}]->(rating:Valoracion) ' +
        'RETURN rating',
        {
          userId,
          targetId,
          score,
          comment,
        }
      );
  
      return result.records[0].get('rating').properties;
    }
  }
  
 export default Rating;
  