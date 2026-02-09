import {useState} from 'react';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: PostData | null;
    onSuccess: (post: never) => void;
}

const PostModal = ({ isOpen, onClose, initialData, onSuccess }: Props) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            if (title.length === 0 || description.length === 0) {
                alert("Поля не можуть бути пустими");
                return;
            }
            if (title.length > 99) {
                alert("Заголовок занадто довгий");
                return;
            }

            if (description.length < 10) {
                alert("Опис має містити хоча б 10 символів");
                return;
            }
            const token = localStorage.getItem('token');
            const isEdit = !!initialData?.id;



            const url = isEdit
                ? `http://localhost:3000/posts/${initialData.id}`
                : 'http://localhost:3000/posts';

            const method = isEdit ? 'patch' : 'post';

            console.log("Is Edit Mode: ", isEdit);
            console.log("Initial Data ID: ", initialData?.id);
            console.log("Method: ", method);
            console.log("Url: ", url);

            const response = await axios[method](url,
                {
                    title: title,
                    description: description
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );

            if (response.status === 201) {
                setTitle('');
                setDescription('');
            }

            onSuccess?.(response.data);
            onClose();
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося зберегти пост');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '8px',
                    width: '400px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{marginTop: 0}}>{initialData ? 'Редагувати пост' : 'Створити пост'}</h3>

                <input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        marginBottom: '15px',
                        padding: '10px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />

                <textarea
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                        width: '100%',
                        height: '100px',
                        resize: 'none',
                        padding: '10px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#f0f0f0'
                        }}
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Зберегти
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PostModal;