import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import PetCategory from '../../components/PetCategory/PetCategory';
import Search from '../../components/Search/Search';
import Sorting from '../../components/Sorting/Sorting';

const Home = () => {
  // Datos de ejemplo para las categorías
  const categories = [
    {
      name: 'Perros',
      pets: [
        {
          id: 1,
          image: 'https://th.bing.com/th/id/R.c89666e4565ae522d3881a2832de7c4c?rik=UDW07tsPq5Dq%2bg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-9f4QjZbw7dg%2fUnKFfrU32zI%2fAAAAAAAAAC0%2fGRq9jY25JnQ%2fs1600%2fraca-bichon-maltes.jpg&ehk=SMyrytGQgjm%2bFwjIG8iE1BwCn9I45%2b0KO4jvN73YbY0%3d&risl=&pid=ImgRaw&r=0',
          raza: 'Golden Retriever',
          edad: '3 años',
          color: 'Dorado',
          tamaño: 'Grande',
        },
        {
          id: 1,
          image: 'https://th.bing.com/th/id/R.c89666e4565ae522d3881a2832de7c4c?rik=UDW07tsPq5Dq%2bg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-9f4QjZbw7dg%2fUnKFfrU32zI%2fAAAAAAAAAC0%2fGRq9jY25JnQ%2fs1600%2fraca-bichon-maltes.jpg&ehk=SMyrytGQgjm%2bFwjIG8iE1BwCn9I45%2b0KO4jvN73YbY0%3d&risl=&pid=ImgRaw&r=0',
          raza: 'Golden Retriever',
          edad: '3 años',
          color: 'Dorado',
          tamaño: 'Grande',
        },
        {
          id: 1,
          image: 'https://th.bing.com/th/id/R.c89666e4565ae522d3881a2832de7c4c?rik=UDW07tsPq5Dq%2bg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-9f4QjZbw7dg%2fUnKFfrU32zI%2fAAAAAAAAAC0%2fGRq9jY25JnQ%2fs1600%2fraca-bichon-maltes.jpg&ehk=SMyrytGQgjm%2bFwjIG8iE1BwCn9I45%2b0KO4jvN73YbY0%3d&risl=&pid=ImgRaw&r=0',
          raza: 'Golden Retriever',
          edad: '3 años',
          color: 'Dorado',
          tamaño: 'Grande',
        },
        {
          id: 1,
          image: 'https://th.bing.com/th/id/R.c89666e4565ae522d3881a2832de7c4c?rik=UDW07tsPq5Dq%2bg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-9f4QjZbw7dg%2fUnKFfrU32zI%2fAAAAAAAAAC0%2fGRq9jY25JnQ%2fs1600%2fraca-bichon-maltes.jpg&ehk=SMyrytGQgjm%2bFwjIG8iE1BwCn9I45%2b0KO4jvN73YbY0%3d&risl=&pid=ImgRaw&r=0',
          raza: 'Golden Retriever',
          edad: '3 años',
          color: 'Dorado',
          tamaño: 'Grande',
        },
      ],
    },
    {
      name: 'Gatos',
      pets: [
        {
          id: 2,
          image: 'url_de_la_imagen_gato',
          raza: 'Siamese',
          edad: '2 años',
          color: 'Blanco y Negro',
          tamaño: 'Mediano',
        },
        // Agrega más datos de gatos según sea necesario
      ],
    },
    // Agrega más categorías según sea necesario
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <Search />
          <Sorting />
          {/* Renderizar las categorías con sus respectivas mascotas */}
          {categories.map((category) => (
            <PetCategory
              key={category.name}
              categoryName={category.name}
              pets={category.pets}
              // Puedes agregar más propiedades según sea necesario
            />
          ))}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
