import Posts from "./Posts.tsx";
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import PostModal from "./PostModal.tsx";

interface DecodedToken {
    sub: number;
    email: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', {replace: true});
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const id = decoded.sub;

            if (id) {
                setUserId(id);
                setLoading(false);
            } else {
                throw new Error('ID не знайдено в токені');
            }
        } catch (error) {
            console.error('Помилка при декодуванні токена:', error);
            localStorage.removeItem('token');
            navigate('/login', {replace: true});
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSuccess = (data: never) => {
        console.log("Пост створено в Home:", data);
        window.location.reload();
    };

    if (loading) {
        return <div>Завантаження...</div>;
    }

    const myPostsUrl = `http://localhost:3000/posts/user/${userId}`;
    const allPostsUrl = `http://localhost:3000/posts?excludeUserId=${userId}`;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '99vw',
            height: '99vh',
            flex: 1,
            boxSizing: 'border-box',
            padding: '20px',
            overflow: 'hidden'
        }}>
            {/* ВЕРХНЯ ПАНЕЛЬ (Кнопки) */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexShrink: 0
            }}>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button
                        onClick={() => setActiveTab('my')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: activeTab === 'my' ? '#007bff' : '#ccc',
                            color: activeTab === 'my' ? 'white' : 'black',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            marginLeft: '20px',
                        }}
                    >
                        Мої пости
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: activeTab === 'all' ? '#007bff' : '#ccc',
                            color: activeTab === 'all' ? 'white' : 'black',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}
                    >
                        Всі пости
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}
                    >
                        Створити пост
                    </button>
                </div>

                <button onClick={logout} style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '20px',
                }}>Вийти
                </button>
            </div>

            {/* НИЖНЯ ПАНЕЛЬ */}
            <div style={{
                flex: 1,
                display: 'flex',
                width: '100%',
                minHeight: 0
            }}>
                {activeTab === 'my' && <Posts key="my-posts" apiUrl={myPostsUrl}/>}
                {activeTab === 'all' && <Posts key="all-posts" apiUrl={allPostsUrl}/>}
            </div>

            <PostModal
                key={'new'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}