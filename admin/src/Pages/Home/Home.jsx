import React, {useEffect} from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import { useAuth } from '../../context/AuthContexto';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return <div>Redirecting...</div>;
  }
    return (
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />
    
          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <Header />
    
            {/* Page Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
            
            </main>
          </div>
        </div>
      );
}


export default Home