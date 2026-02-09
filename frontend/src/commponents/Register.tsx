import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/auth/register", {email, password, name});
            alert('Успішно зареєстровано!');
            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;
                setError(Array.isArray(message) ? message[0] : message || 'Помилка');
            } else {
                setError('Сталася непередбачувана помилка');
            }
        }
    }

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
                <h2>Реєстрація</h2>
                <form onSubmit={handleRegister}  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    <input type="text" placeholder="Ім'я" onChange={e => setName(e.target.value)} required style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px'
                    }} />
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px'
                    }} />
                    <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} required style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px'
                    }} />
                    <button type="submit">Створити акаунт</button>
                </form>
                {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
                <Link to="/login">Вже є акаунт? Увійти</Link>
            </div>
        </div>
    );
}