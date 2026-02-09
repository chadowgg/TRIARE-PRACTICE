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

## API Reference

### Authentication Module
| Method | Endpoint | Functionality | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Реєстрація нового користувача | ❌ |
| `POST` | `/auth/login` | Вхід та отримання JWT токена | ❌ |
| `GET` | `/auth/profile` | Отримання даних поточного профілю | ✅ |

### Posts Module
| Method | Endpoint | Functionality | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/posts` | Отримати всі пости (Pagination & Exclude User) | ❌ |
| `GET` | `/posts/:id` | Отримати деталі одного поста за ID | ❌ |
| `GET` | `/posts/user/:userId` | Отримати всі пости конкретного автора | ❌ |
| `POST` | `/posts` | Створити новий пост | ✅ |
| `PATCH` | `/posts/:id` | Оновити існуючий пост (власник) | ✅ |
| `DELETE` | `/posts/:id` | Видалити пост (власник) | ✅ |

### Comments & Voting
| Method | Endpoint | Functionality | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/comments/post/:postId` | Отримати коментарі до поста (Pagination) | ❌ |
| `POST` | `/comments` | Додати новий коментар до поста | ✅ |
| `PATCH` | `/comments/:commentId` | Редагувати текст коментаря | ✅ |
| `DELETE` | `/comments/:commentId` | Видалити коментар | ✅ |
| `PATCH` | `/comments/:commentId/vote` | Голосувати (Like: 1 / Dislike: -1) | ✅ |
