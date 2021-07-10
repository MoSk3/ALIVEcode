import './App.css';
import { RouterSwitch } from './Router/RouterSwitch/RouterSwitch';
import { BrowserRouter as Router } from "react-router-dom";
import ALIVENavbar from './Components/MainComponents/Navbar/Navbar';
import { UserContext } from './UserContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from './Types/User';
import axios from 'axios';

const App = () => {

  const [user, setUser] = useState<User | null>(null);

  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser])

  useEffect(() => {
    console.log("IIII")
    const getUser = async () => {
      const user: User = (await axios.get('/user/info/')).data;
      console.log(user)
      setUser(user);
    }
    getUser();
  }, []);

  useEffect(() => {
    console.log("AAAAA")
  })

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
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
