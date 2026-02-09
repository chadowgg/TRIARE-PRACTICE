import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import type {AuthResponse} from "../types/auth.ts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const res = await axios.post<AuthResponse>(
                "http://localhost:3000/auth/login",
                {email, password}
            );
            localStorage.setItem('token', res.data.access_token);
            window.dispatchEvent(new Event('storage-update'));
            navigate("/");

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Помилка: невірний логін або пароль')
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
        }}>
            <div style={{
                border: '1px solid black',
                padding: '20px',
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}>
                <h2>Увійти</h2>
                <form onSubmit={handleLogin}
                      style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          width: '100%',
                          boxSizing: 'border-box',
                      }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '8px'
                        }}/>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '8px'
                        }}/>
                    <button type="submit">Увійти</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <Link to="/register">Немає акаунту? Реєстрація</Link>
            </div>
        </div>
    );
}