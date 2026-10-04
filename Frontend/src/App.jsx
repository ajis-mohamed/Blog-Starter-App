import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import auth from './config/configFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const URL = 'https://blog-starter-app-717g.onrender.com/';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const response = await axios.get(`${URL}users?uid=${currentUser.uid}`);
          setRole(response.data);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
        setRole('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FBF9F5] text-[#2C2C2A]">
        <p className="font-serif text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;