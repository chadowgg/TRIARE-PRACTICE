import {BrowserRouter as Router, Route, Navigate, Routes} from "react-router-dom";
import Login from './commponents/Login';
import Register from './commponents/Register.tsx';
import Home from './commponents/Home.tsx';
import {useEffect, useState} from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage-update', checkAuth);
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage-update', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Home/> : <Navigate to="login"/>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;