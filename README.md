# Comp Shop API

**Описание:**  
API для магазина компьютерной техники на NestJS с TypeScript, Prisma и PostgreSQL. В проекте реализованы модули пользователей, продуктов, заказов и аутентификации. Swagger используется для документации API.

---

## 📂 Структура проекта

ready/
├─ src/ # Исходный код TypeScript
│ ├─ authentication/
│ ├─ product/
│ ├─ prisma/ # Prisma schema и миграции
│ ├─ order/
│ └─ main.ts
├─ dist/ # Скомпилированный код (TS -> JS)
├─ package.json
├─ tsconfig.json
├─ tsconfig.build.json
└─ .env # Переменные окружения (БД, порт и др.)


---

## ⚡ Установка

1. Клонировать проект:
```bash
git clone <repo-url>
cd ready

    Установить зависимости:

npm install

    Создать файл .env на основе .env.example:

DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3000

    Сгенерировать Prisma клиент:

npx prisma generate

    Применить миграции (если есть):

npx prisma migrate dev

🏗 Сборка TypeScript

Для компиляции TypeScript и копирования Prisma схемы в dist:

npm run build

Команда выполняет:

    tsc -p tsconfig.build.json — компиляция TypeScript в dist

    Копирование папки prisma в dist/prisma

🚀 Запуск приложения
Локально (без Docker)

npm run start:dev

    API будет доступен по http://localhost:3000

    Swagger документация — http://localhost:3000/api
📦 Prisma

    Схема хранится в prisma/schema.prisma

    Генерация клиента:

npx prisma generate

    Миграции:

npx prisma migrate dev

    Для Docker можно явно указать путь к схеме:
    npx prisma generate --schema=src/prisma/schema.prisma

📖 Swagger

Документация доступна по пути:

http://localhost:3000/api