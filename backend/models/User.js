
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

    async consultarAdopcion(userNode, petNode) {
      const result = await this.session.run(
        'MATCH (user:Usuario {id: $userId})-[r:SOLICITA_ADOPTAR|ADOPTÓ]->(pet:Mascota {id: $petId}) RETURN r',
        {
          userId: userNode.properties.id,
          petId: petNode.properties.id,
        }
      );
    
      return result.records.length > 0 ? result.records[0].get('r') : null;
    }
    

    async solicitarAdopcion(userNode, petNode) {
      const transaction = this.session.beginTransaction();
    
      try {
        // Crea la relación SOLICITA_ADOPTAR entre el usuario y la mascota
        await transaction.run(
          'MATCH (user:Usuario {id: $userId}), (pet:Mascota {id: $petId}) ' +
          'CREATE (user)-[:SOLICITA_ADOPTAR]->(pet)',
          {
            userId: userNode.properties.id,
            petId: petNode.properties.id,
          }
        );
    
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    

    async confirmarAdopcion(userNode, petNode) {
      const transaction = this.session.beginTransaction();
    
      try {
        // Verifica que la mascota esté disponible para adopción
        if (petNode.properties.estadoAdopcion !== 'Disponible') {
          throw new Error('La mascota no está disponible para adopción.');
        }
    
        // Verifica que el usuario haya solicitado la adopción de la mascota
        const solicitudRelationship = await this.session.run(
          'MATCH (user:Usuario {id: $userId})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {id: $petId}) RETURN r',
          {
            userId: userNode.properties.id,
            petId: petNode.properties.id,
          }
        );
    
        if (solicitudRelationship.records.length === 0) {
          throw new Error('El usuario no ha solicitado la adopción de esta mascota.');
        }
    
        // Actualiza la relación a DESEA_ADOPCIONAR
        await transaction.run(
          'MATCH (user:Usuario {id: $userId})-[r:SOLICITA_ADOPTAR]->(pet:Mascota {id: $petId}) ' +
          'CREATE (user)-[r2:ADOPTÓ]->(pet) ' +
          'DELETE r',
          {
            userId: userNode.properties.id,
            petId: petNode.properties.id,
          }
        );
    
        // Actualiza el estado de adopción de la mascota a 'Adoptada'
        await transaction.run(
          'MATCH (pet:Mascota {id: $petId}) SET pet.estadoAdopcion = "Adoptado"',
          {
            petId: petNode.properties.id,
          }
        );
    
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
    
    async solicitarAdopcion(petNode) {
      try {
        // Crear una solicitud de adopción
        await this.adoptionRequest.createAdoptionRequest({
          petId: petNode.properties.id,
          userId: this.id,
          estado: 'Pendiente', // Puedes ajustar el estado según tu lógica
        });
  
        // Lógica adicional según necesidades específicas
      } catch (error) {
        console.error(error);
        throw new Error('Error al solicitar la adopción');
      }
    }
    
    
  }
  
  export default User;