
class User {
    constructor(session) {
      this.session = session;
    }

    async verificarCredenciales(nombreUsuario, contrasena) {
      const result = await this.session.run(
        'MATCH (user:Usuario {usuario: $nombreUsuario, password: $contrasena}) RETURN user',
        {
          nombreUsuario,
          contrasena,
        }
      );
  
      return result.records[0].get('user').properties;
    }
  
    async createUser(properties) {
      const result = await this.session.run('CREATE (user:Usuario $properties) RETURN user', {
        properties,
      });
  
      return result.records[0].get('user').properties;
    }
  
    async findUserByUsername(usuario) {
      const result = await this.session.run('MATCH (user:Usuario {usuario: $usuario}) RETURN user', {
        usuario,
      });
    
      if (result.records.length === 0) {
        return null; // Usuario no encontrado
      }
    
      return result.records[0].get('user').properties;
    }
    async findOnlyUsername(usuario) {
      const result = await this.session.run('MATCH (user:Usuario {usuario: $usuario}) RETURN user.usuario AS usuario', {
        usuario,
      });
    
      if (result.records.length === 0) {
        return null; // Usuario no encontrado
      }
    
      return result.records[0].get('usuario');
    }
    
  
    async updateUser(username, updatedProperties) {
      const result = await this.session.run(
        'MATCH (user:Usuario {usuario: $username}) SET ' +
        Object.keys(updatedProperties).map(key => `user.${key} = $updatedProperties.${key}`).join(', ') +
        ' RETURN user',
        {
          username,
          updatedProperties,
        }
      );
    
      if (result.records.length === 0) {
        return null; // Usuario no encontrado
      }
    
      return result.records[0].get('user').properties;
    }
    
  
  
    async deleteUser(username) {
      await this.session.run('MATCH (user:Usuario {usuario: $username}) SET user.eliminado = true', {
        username,
      });
    }

    async agregarFavorito(usuario, mascotaId, categoria, raza) {
      const cypher = `
        MATCH (u:Usuario {usuario: $usuario})
        MERGE (f:Favorito {mascotaId: $mascotaId})
        ON CREATE SET f.categoria = $categoria, f.raza = $raza
        MERGE (u)-[:TIENE_FAVORITO]->(f)
      `;
    
      try {
        await this.session.run(cypher, { usuario, mascotaId, categoria, raza });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    
    
    
  
    // async obtenerFavoritosPorCategoria(usuario, categoria) {
    //   const cypher = `
    //     MATCH (u:Usuario {id: $usuario})-[:TIENE_FAVORITO_EN_CATEGORIA]->(m:Mascota)-[:TIENE_FAVORITO]->(c:Categoria {categoria: $categoria})
    //     RETURN m.id as mascotaId
    //   `;
    //   const result = await this.session.run(cypher, { usuario, categoria });
    //   return result.records.map(record => record.get('mascotaId'));
    // }
  
    // async obtenerFavoritosPorRaza(usuario, raza) {
    //   const cypher = `
    //     MATCH (u:Usuario {id: $usuario})-[:TIENE_FAVORITO_EN_RAZA]->(m:Mascota)-[:TIENE_FAVORITO]->(r:Raza {nombre: $raza})
    //     RETURN m.id as mascotaId
    //   `;
    //   const result = await this.session.run(cypher, { usuario, raza });
    //   return result.records.map(record => record.get('mascotaId'));
    // }

    
 }
  
  export default User;