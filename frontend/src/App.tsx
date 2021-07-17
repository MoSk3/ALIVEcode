import './App.css';
import { RouterSwitch } from './Router/RouterSwitch/RouterSwitch';
import { BrowserRouter as Router } from "react-router-dom";
import ALIVENavbar from './Components/MainComponents/Navbar/Navbar';
import { UserContext } from './UserContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BackArrow from './Components/MainComponents/BackArrow/BackArrow';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { User } from './Models/User';

const App = () => {

  const [user, setUser] = useState<User | null>(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser])

  useEffect(() => {
    const getUser = async () => {
      const loadedUser = await User.loadUser();
      console.log(loadedUser)
      setUser(loadedUser);
    }
    getUser();
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    axios.defaults.headers['Authorization'] = null;
    setUser(null);
  }, []);

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={providerValue}>
          <ALIVENavbar handleLogout={handleLogout} />
          <section className="m-auto my-4">
            <RouterSwitch />
          </section>
          <BackArrow />
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;