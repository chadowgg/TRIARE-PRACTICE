# Full-Stack Blog

Проект розроблений під час проходження виробничої практики в компанії **TRIARE**. Це комплексна система, що поєднує платформу для публікації контенту.

## Технологічний стек
- **Frontend:** React, TypeScript, Axios
- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Tools:** JWT, Postman, Git

---

## Реєстрація
![Registration](./assets/registration.png)

## Вхід
![Login](./assets/login.png)

## Мої пости
![My_Posts](./assets/my_posts.png)

## Всі пости
![My_Posts](./assets/all_posts.png)

## Пости
![Post](./assets/post.png)
![Post_2](./assets/post_2.png)

## Створити пост
![Create_Post](./assets/create_post.png)

## Редагувати пост
![Create_Post](./assets/editing_a_post.png)

## Редагувати коментарь
![Create_Post](./assets/editing_a_comment.png)

## Пагінація
![Create_Post](./assets/pagination.png)

---

## 📡 API Reference

### 🔐 Auth Module
| Method | Endpoint | Functionality |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/login` | User login & JWT issuance |

### 📄 Posts Module
| Method | Endpoint | Functionality |
| :--- | :--- | :--- |
| `GET` | `/posts` | Get all posts (Pagination support) |
| `POST` | `/posts` | Create a new post (Auth required) |
| `DELETE` | `/posts/:id` | Remove post by ID |

### 🗳️ Comments & Voting
| Method | Endpoint | Functionality |
| :--- | :--- | :--- |
| `GET` | `/comments/post/:postId` | Fetch comments for a specific post |
| `PATCH` | `/comments/:id/vote` | Upvote/Downvote logic (Value: 1 / -1) |
