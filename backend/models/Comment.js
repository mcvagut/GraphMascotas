
class Comment {
    constructor(session) {
      this.session = session;
    }
  
    async createComment(properties) {
      const result = await this.session.run('CREATE (comment:Comentario $properties) RETURN comment', {
        properties,
      });
  
      return result.records[0].get('comment').properties;
    }
  
    async findCommentById(commentId) {
      const result = await this.session.run('MATCH (comment:Comentario {id: $id}) RETURN comment', {
        id: commentId,
      });
  
      if (result.records.length === 0) {
        return null; // Comentario no encontrado
      }
  
      return result.records[0].get('comment').properties;
    }
  
    async updateComment(commentId, updatedProperties) {
      const result = await this.session.run(
        'MATCH (comment:Comentario {id: $id}) SET comment = $updatedProperties RETURN comment',
        {
          id: commentId,
          updatedProperties,
        }
      );
  
      return result.records[0].get('comment').properties;
    }
  
    async deleteComment(commentId) {
      await this.session.run('MATCH (comment:Comentario {id: $id}) DETACH DELETE comment', {
        id: commentId,
      });
    }
  
    async userAddsComment(userId, targetId, content) {
      const result = await this.session.run(
        'MATCH (user:Usuario {id: $userId}), (target:Usuario {id: $targetId}) ' +
        'CREATE (user)-[:PUBLICO_COMENTARIO]->(comment:Comentario {contenido: $content})-[:EN]->(target) ' +
        'RETURN comment',
        {
          userId,
          targetId,
          content,
        }
      );
  
      return result.records[0].get('comment').properties;
    }
  }
  
  export default Comment;
  