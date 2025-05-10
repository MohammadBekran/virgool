# 📘 Virgool Backend API

A scalable, production-ready blogging platform backend built with **NestJS**, **TypeORM**, and **PostgreSQL**, featuring user authentication (including Google OAuth), blogging, commenting, and role-based access control. Deployed seamlessly to **Railway** with Neon as the Postgres provider.

🌐 **Live API Docs**: [https://virgool-production.up.railway.app/swagger](https://virgool-production.up.railway.app/swagger)

---

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/)
- **Deployment:** [Railway](https://railway.app/)
- **Authentication:** JWT + Google OAuth 2.0
- **Validation:** class-validator & class-transformer
- **Docs:** Swagger

---

## 📦 Features

- ✅ **User Authentication** (OTP-based + Google OAuth)
- ✅ **Blog CRUD operations** with slugs and bookmarks
- ✅ **Category Management**
- ✅ **Comment moderation**
- ✅ **Followers/Following system**
- ✅ **Role-based access control**
- ✅ **Block/Unblock users**
- ✅ **Clean architecture with modular NestJS design**
- ✅ **Fully containerized and CI/CD ready**

---

## 🛠️ Installation

```bash
git clone https://github.com/MohammadBekran/virgool.git
cd virgool
cp .env.example .env
npm install
npm run migration:run
npm run start:dev

```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api` (or your chosen global prefix).

### 🔐 Auth

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| POST   | `/auth/user-existence` | Check if user exists & Send OTP          |
| POST   | `/auth/check-otp`      | Verify OTP                               |
| GET    | `/auth/check-login`    | Check login status & Current Return User |
| GET    | `/auth/google`         | Initiate Google OAuth                    |
| GET    | `/auth/redirect`       | Handle Google redirect                   |

### 👤 User

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/user/profile`               | Get current user profile           |
| PATCH  | `/user/change-email`          | Change user email                  |
| PATCH  | `/user/change-phone`          | Change phone number                |
| PATCH  | `/user/change-username`       | Change username                    |
| PATCH  | `/user/add-role-to-user`      | Add role to user (Admin only)      |
| PATCH  | `/user/remove-role-from-user` | Remove role from user (Admin only) |
| POST   | `/user/verify-email-otp`      | Verify email with OTP              |
| POST   | `/user/verify-phone`          | Verify phone number                |
| POST   | `/user/toggle-block`          | Block/unblock user (Admin only)    |
| GET    | `/user/follow/:followingId`   | Follow a user                      |
| GET    | `/user/followers`             | List followers                     |
| GET    | `/user/followings`            | List followings                    |
| GET    | `/user/roles`                 | Get available roles (Admin only)   |

### 🗂️ Category

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/category`     | Create new category |
| GET    | `/category`     | Get all categories  |
| GET    | `/category/:id` | Get category by ID  |
| PATCH  | `/category/:id` | Update category     |
| DELETE | `/category/:id` | Delete category     |

### 📝 Blog

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| POST   | `/blog`               | Create a blog              |
| GET    | `/blog/my-blogs`      | Get logged-in user's blogs |
| GET    | `/blog`               | Get all blogs              |
| GET    | `/blog/by-id/:id`     | Get blog by ID             |
| GET    | `/blog/by-slug/:slug` | Get blog by slug           |
| DELETE | `/blog/:id`           | Delete a blog              |
| PUT    | `/blog/:id`           | Update a blog              |
| GET    | `/blog/like/:id`      | Like/Unlike a blog         |
| GET    | `/blog/bookmark/:id`  | Bookmark/Unbookmark blog   |

### 💬 Comment

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/comment`             | Create comment              |
| GET    | `/comment`             | Get all comments            |
| GET    | `/comment/my-comments` | Get user's comments         |
| PATCH  | `/comment/accept/:id`  | Accept comment (Admin only) |
| PATCH  | `/comment/reject/:id`  | Reject comment (Admin only) |

---

## 🛠 Folder Structure

```bash
src/
├── main.ts
├── configs/
│   ├── swagger.config.ts
│   ├── typeorm.config.ts
│   └── typeorm.ts
├── migrations/
├── modules/
│   ├── app/
│   ├── auth/
│   ├── blog/
│   ├── category/
│   ├── image/
│   └── user/
└── common/
    ├── abstracts/
    ├── constants/
    ├── utils/
    ├── decorators/
    ├── middlewares/
    ├── dtos/
    ├── enums/
    ├── interceptors/
    └── types/
```

---

## 🌍 Deployment

> This app is deployed on [Railway](https://railway.app) with PostgreSQL provided by [Neon](https://neon.tech). Environment variables are managed securely via `.env`.

---

## 📄 License

This project is **UNLICENSED** – intended for personal showcase and academic use.

---

## 🤝 Contributing

You're welcome to fork the repo or open issues for suggestions or improvements. Feel free to reach out via LinkedIn or email.

---

## 📬 Contact

**Email** – [bhshtmhmd1@gmail.com]  
**GitHub** – [@MohammadBekran](https://github.com/MohammadBekran)  
**LinkedIn** – [www.linkedin.com/in/mohamamd-bekran](www.linkedin.com/in/mohamamd-bekran)

---

## 🔖 Tags

#NestJS #TypeORM #PostgreSQL #Railway #Neon #Backend #BlogAPI #OAuth #Swagger #RESTAPI
