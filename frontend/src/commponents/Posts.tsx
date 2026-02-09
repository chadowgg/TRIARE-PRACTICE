import {useState, useEffect} from 'react';
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import PostModal from "./PostModal.tsx";
import InfiniteScroll from "react-infinite-scroll-component";

interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
}

interface Post {
    description: string;
    userId: number;
    id: number;
    title: string;
    user: User;
}

interface PostsResponse {
    massage: string;
    post: Post;
}


interface Comment {
    comment_like: number;
    post_comment: string;
    user: User;
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

interface PaginatedPosts {
    data: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface PropsApi {
    apiUrl: string;
}

export default function Posts({apiUrl}: PropsApi) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsLimit = 10;
    const token = localStorage.getItem('token');
    const currentUser = token ? jwtDecode(token) : null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [commentPage, setCommentPage] = useState(1);
    const [totalCommentsPage, setTotalCommentsPage] = useState(1);
    const commentsLimit = 5;

    useEffect(() => {
        console.log('apiUrl changed:', apiUrl); // Debug
        setPosts([]);
        setSelectedPost(null);
        setComments([]);
        setCurrentPage(1);
        setSearchQuery('');
        setTotalPages(1);
    }, [apiUrl]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const separator = apiUrl.includes('?') ? '&' : '?';
                const url = `${apiUrl}${separator}page=${currentPage}&limit=${postsLimit}`;

                console.log('Fetching:', url); // Debug

                const response = await axios.get<PaginatedPosts>(url);

                const result = response.data;

                console.log('Result:', result); // Debug

                setPosts(result.data);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error('Помилка завантаження постів: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [apiUrl, currentPage]);

    useEffect(() => {
        if (selectedPost) {
            setComments([]);
            setCommentPage(1);
            setTotalCommentsPage(1);
            fetchMoreComments(selectedPost.id, true);
        }
    }, [selectedPost?.id]);

    const fetchMoreComments = async (postId: number, isInitial = false) => {
        try {
            setCommentsLoading(true);

            const pageToFetch = isInitial ? 1 : commentPage;

            const response = await axios.get(
                `http://localhost:3000/comments/post/${postId}?page=${pageToFetch}&limit=${commentsLimit}`
            );

            const newComments = response.data.data;

            console.log('Comments:', newComments); // Debug

            setComments(prev => {
                if (isInitial) return newComments;
                
                const existingIds = new Set(prev.map(c => c.id));
                const uniqueNewComments = newComments.filter((comment: { id: number; }) => !existingIds.has(comment.id));
                return [...prev, ...uniqueNewComments];
            });

            setCommentPage(pageToFetch + 1);
            setTotalCommentsPage(response.data.totalPages);
        } catch (error) {
            console.error('Помилка завантаження коментарів:', error);  // Debug
        } finally {
            setCommentsLoading(false);
        }
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setComments([]);
        fetchMoreComments(post.id);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleSuccess = (data: PostsResponse) => {
        console.log("Отримано від сервера:", data);  // Debug
        const updatedPost = data.post;
        if (!updatedPost) return;

        setPosts((prevPosts) => {
            return prevPosts.map((p) => {
                if (p.id === updatedPost.id) {

                    return {...p, ...updatedPost};
                }
                return p;
            });
        });

        if (selectedPost && selectedPost.id === updatedPost.id) {
            setSelectedPost(updatedPost);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей пост?')) return;

        try {
            await axios.delete(`http://localhost:3000/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
            window.location.reload();
        } catch (error) {
            alert('Помилка при видаленні');
            console.error('Помилка при видаленні:', error); // Debug
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post('http://localhost:3000/comments', {
                postComment: commentText,
                postId: selectedPost?.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments(prev => [response.data, ...prev]);
            setCommentText('');
        } catch (error) {
            console.error("Помилка при додаванні коментаря:", error); // Debug
        }
    }

    const handleUpdateComment = async (commentId: number, newText: string) => {
        if (!newText.trim()) return;

        try {
            const response = await axios.patch(`http://localhost:3000/comments/${commentId}`,
                { post_comment: newText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComments(prev => prev.map(c => c.id === commentId ? response.data : c));

            setEditingCommentId(null);
        } catch (error) {
            console.error("Помилка при оновлені коментаря:", error); // Debug
        }
    };

    const handleDeleteComment = async (commentId: number) => {
      try {
          const response = await axios.delete(`http://localhost:3000/comments/${commentId}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
          console.log('Comments:', response);
          setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
      } catch (error) {
          console.error("Помилка при видалені коментаря:", error); // Debug
      }
    }

    const handleLike = async (commentId: number, val: number) => {
        try {
            const response = await axios.patch(`http://localhost:3000/comments/${commentId}/vote`,
                {value: val},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const updateComment = response.data;

            setComments(prev => prev.map(c =>
                c.id === commentId ? {...c, comment_like: updateComment.comment_like} : c
            ));
        } catch (error) {
            console.error('Помилка при голосуванні:', error);
            alert('Не вдалося проголосувати. Можливо, ви не авторизовані?');
        }
    };

    const filteredPosts = searchQuery.trim()
        ? posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : posts;

    if (loading) {
        return <div style={{padding: '20px'}}>Завантаження постів...</div>;
    }

    const handleCancel = () => {
        setCommentText('');
    };

    return (
        <div style={{
            padding: '20px',
            display: 'flex',
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box',
            minHeight: '80vh',
        }}>
            {/* ЛІВИЙ БЛОК - пости */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #ccc',
                paddingRight: '20px',
                minWidth: '300px',
            }}>
                <h2>Пости</h2>

                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Шукати пости..."
                    style={{
                        padding: '10px',
                        marginBottom: '15px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                    }}
                />

                {filteredPosts.length === 0 ? (
                    <p style={{color: '#999'}}>Нічого не знайдено</p>
                ) : (
                    filteredPosts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => handlePostClick(post)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '10px',
                                margin: '10px 0',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                backgroundColor: selectedPost?.id === post.id ? '#e3f2fd' : 'white'
                            }}
                        >
                            <div style={{flex: 1}}>
                                <h3 style={{margin: '0 0 5px 0', fontSize: '16px'}}>{post.title}</h3>
                                <p style={{margin: 0, fontSize: '14px', color: '#666'}}>
                                    {post.description.substring(0, 100) || "Немає опису"}
                                    {post.description.length > 60 ? '...' : ''}
                                </p>
                            </div>
                            {currentUser && post.user.id === currentUser.sub && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePost(post.id);
                                    }}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#d57e7e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Видалити
                                </button>
                            )}
                        </div>
                    ))
                )}

                {/*Пагінація */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '20px',
                    padding: '10px'
                }}>
                    <div style={{display: 'flex', gap: '5px'}}>
                        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: currentPage === page ? '#007bff' : 'white',
                                    color: currentPage === page ? 'white' : 'black',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontWeight: currentPage === page ? 'bold' : 'normal'
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ПРАВИЙ БЛОК - коментарі */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: '300px',
            }}>
                {!selectedPost ? (
                    <p style={{color: '#999'}}>Обери пост щоб побачити коментарі</p>
                ) : (
                    <>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <h2>{selectedPost.title}</h2>
                            <span style={{marginLeft: 'auto'}}>{selectedPost.user.name}</span>
                        </div>

                        <p>{selectedPost.description}</p>
                        {currentUser && selectedPost && selectedPost.user?.id === currentUser.sub && (
                            <>
                                <button
                                    style={{ padding: '10px', width: '200px', outline: 'none'}}
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Редагувати пост
                                </button>

                                <PostModal
                                    key={selectedPost.id}
                                    isOpen={isModalOpen}
                                    initialData={selectedPost}
                                    onClose={() => setIsModalOpen(false)}
                                    onSuccess={handleSuccess}
                                />
                            </>
                        )}

                        <h3>Коментарі:</h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                        }}>
                            <input
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Введіть коментарь"
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <button style={{
                                color: 'white',
                                backgroundColor: '#2ac9cf',
                                border: 'none',
                            }}
                            onClick={handleSendComment}
                            >
                                Залишити
                            </button>

                            <button style={{
                                color: 'white',
                                backgroundColor: '#d57eaa',
                                border: 'none',
                            }}
                            onClick={handleCancel}
                            >
                                Відміна
                            </button>
                        </div>
                        {commentsLoading ? (
                            <p>Завантаження коментарів...</p>
                        ) : (
                            <InfiniteScroll
                                dataLength={comments.length}
                                next={() => fetchMoreComments(selectedPost!.id)}
                                hasMore={commentPage <= totalCommentsPage}
                                loader={<p>Завантаження...</p>}
                                endMessage={<p>Це всі коментарі</p>}
                            >
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            padding: '10px',
                                            margin: '10px 0',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <strong>{comment.user?.name}</strong>

                                        {editingCommentId === comment.id ? (
                                            <div style={{ marginTop: '10px' }}>
                                                <input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '13px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '5px',
                                                        boxSizing: 'border-box',
                                                    }}
                                                />
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '5px',
                                                    marginTop: '10px'
                                                }}>
                                                    <button
                                                        onClick={() => handleUpdateComment(comment.id, editValue)}
                                                        style={{
                                                            color: 'white',
                                                            backgroundColor: '#2ac9cf',
                                                            border: 'none',
                                                            padding: '5px 5px '
                                                        }}
                                                    >
                                                        Зберегти
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        style={{
                                                            color: 'white',
                                                            backgroundColor: '#d57eaa',
                                                            border: 'none',
                                                            padding: '0px 5px '
                                                        }}
                                                    >
                                                        Відмінити
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p>{comment.post_comment}</p>
                                                <p>Рейтинг:
                                                    <button style={{
                                                        border: 'none',
                                                        outline: 'none'
                                                    }}
                                                    onClick={() => handleLike(comment.id, 1)}
                                                    >
                                                        ⬆
                                                    </button>
                                                    {comment.comment_like}
                                                    <button style={{
                                                        border: 'none',
                                                        outline: 'none'
                                                    }}
                                                    onClick={() => handleLike(comment.id, -1)}
                                                    >
                                                        ⬇
                                                    </button>
                                                </p>

                                                {currentUser && comment.user?.id === currentUser.sub && (
                                                    <div>
                                                        <button
                                                            onClick={() => {
                                                                setEditingCommentId(comment.id);
                                                                setEditValue(comment.post_comment);
                                                            }}
                                                            style={{
                                                                border: 'none',
                                                            }}
                                                        >
                                                            Редагувати
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            style={{
                                                                border: 'none',
                                                            }}
                                                        >
                                                            Видалити
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </InfiniteScroll>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
