
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
 }
  
  export default User;