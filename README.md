# 🧠 NestJS API Lab

A collection of **small backend experiments and API modules** built using **NestJS**, designed to explore real-world backend concepts like authentication, CRUD, guards, pipes, and Prisma integration.

This repo is my backend learning playground — every module focuses on a specific feature or concept.

---

## 🚀 Tech Stack

- ⚙️ **NestJS** — Node.js framework for scalable backend apps
- 🗄️ **Prisma / Mongoose** — ORM or ODM for database handling
- 🔐 **JWT Authentication** — Secure login and user sessions
- 🧰 **Class-Validator / Class-Transformer** — Request validation
- 🧾 **Swagger** — API documentation

---

## 🧩 API Modules (In Progress)

| #   | Module | Description                           | Status  |
| --- | ------ | ------------------------------------- | ------- |
| 1   | App    | Welcome                               | ✅ Done |
| 2   | Auth   | Auth JWT signup/signin using mongoose | ✅ Done |
| 3   | User   | User get own profile with auth-guard  | ✅ Done |

---

## 🧭 Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://github.com/brijeshdevio/nestjs-api-lab.git
cd nestjs-api-lab
pnpm install
```

### 2️⃣ Environment Setup

Create `.env` file using the example below:

```bash
PORT=4000
MONGODB_URI=
JWT_SECRET=
```

### 3️⃣ Run the App

```bash
# Development mode
pnpm  start:dev

# Build for production
pnpm build && pnpm start:prod
```

App runs on **[http://localhost:3000](http://localhost:3000)**

---

## 📘 Learning Goals

- Practice backend patterns in small, isolated modules
- Master NestJS concepts: Modules, Guards, Pipes, Providers
- Understand request/response lifecycle
- Learn how to structure production-grade APIs
- Improve backend testing confidence

---

## 🧑‍💻 Author

**Brijesh — Software Engineer (React + NestJS)**

- 🐙 [GitHub](https://github.com/brijeshdevio)
- ✉️ [brijeshio@duck.com](mailto:brijeshio@duck.com)

---

## 📄 License

This project is licensed under the **MIT License** — free to use and modify.

---

⭐ **Star this repo** if you like my backend experiments and want to see more modules added soon!
