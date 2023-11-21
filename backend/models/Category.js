import { v4 as uuidv4 } from 'uuid';
class Categoria {
    constructor(session) {
      this.session = session;
    }
  
    async obtenerCategorias() {
        const result = await this.session.run('MATCH (c:Category) RETURN c.categoriaId AS categoriaId, c.tipo AS tipo');
        return result.records.map(record => record.toObject());
      }
    
      async crearCategoria(tipo) {
        const categoriaId = uuidv4();
        await this.session.run('CREATE (c:Category {categoriaId: $categoriaId, tipo: $tipo})', {
          categoriaId,
          tipo,
        });
      }
  }
  
export default Categoria;
  