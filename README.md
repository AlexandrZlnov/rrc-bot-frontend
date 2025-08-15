README (Run & Configure)
# Telegram Admin Panel

## 1) Install

```bash
npm i
cp .env.example .env  # and set VITE_API_BASE_URL
npm run dev
2) Backend endpoints expected
•	POST /auth — returns { access_token, refresh_token }
•	POST /auth/refresh — accepts { access_token, refresh_token }
•	POST /auth/logout — same payload as refresh
•	GET /admin/blocks — list (or ?id=<uuid> for details)
•	POST /admin/blocks — create
•	PATCH /admin/blocks?id=<uuid> — update
•	PATCH /admin/blocks/search-visibility?id=<uuid> — toggle
•	GET /admin/search-stats/top — array of { query, count }
•	GET /admin/search-stats/worst — array of { query, count }
•	GET /admin/employees — array of { id, tg_name, tg_id, is_blocked } (adjust if different)
3) Customize
•	Edit src/services/*.ts if your routes differ
•	If you add DELETE on the backend, you can add a delete button in BlocksPage


------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------

📦 React Admin Panel для Go Telegram Bot — Полный пакет

Это готовая к запуску админ-панель на React + Vite + TypeScript, работающая с вашим Go-бэкендом.

Ниже приведена пошаговая инструкция для запуска в VS Code, рассчитанная на пользователя без опыта фронтенд-разработки.

1. Установка необходимых программ

Node.js (включает npm)

Скачайте с сайта: https://nodejs.org/en

Выберите версию LTS.

Установите с настройками по умолчанию.

После установки проверьте в терминале:

node -v
npm -v

Должны отобразиться номера версий.

VS Code

Скачайте с сайта: https://code.visualstudio.com/

Установите и откройте.

2. Подготовка проекта

Создайте папку для админ-панели (например, telegram-admin).

Скопируйте в эту папку все предоставленные файлы проекта.

Откройте папку в VS Code.

3. Установка зависимостей

В терминале VS Code (Ctrl + ~) выполните:

npm install

Это прочитает package.json и установит все необходимые пакеты.

4. Настройка переменных окружения

Сделайте копию файла .env.example и назовите её .env.

Откройте .env и укажите:

VITE_API_BASE_URL=http://localhost:8080

Если ваш Go-бэкенд доступен по другому адресу, замените URL.

5. Запуск в режиме разработки

npm run dev

Панель запустится по адресу http://localhost:5173.

Откройте этот адрес в браузере.

6. Сборка для продакшена (по желанию)

Для создания оптимизированной версии:

npm run build

Готовые файлы будут в папке dist/.

7. Требования к API бэкенда

Ваш Go-бэкенд должен поддерживать следующие маршруты:

POST /auth — возвращает { access_token, refresh_token }

POST /auth/refresh

POST /auth/logout

GET /admin/blocks

POST /admin/blocks

PATCH /admin/blocks

PATCH /admin/blocks/search-visibility

GET /admin/search-stats/top

GET /admin/search-stats/worst

GET /admin/employees



------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------


React Admin Panel for Go Telegram Bot — Full Package
Below is a ready-to-run React + Vite + TypeScript admin panel that works against your Go backend routes. It includes:
•	Auth (login, refresh, logout) using JWT stored in memory with refresh-token fallback
•	Menu Blocks CRUD UI (Create/Update, toggle search visibility)
•	Search stats (Top / Worst queries)
•	Users list page (wired to /admin/employees — you can adjust to your actual endpoint)
•	Route guarding, API client with interceptors, minimal UI with Tailwind + shadcn/ui
Copy the files into a new repo, run npm i and npm run dev. Adjust VITE_API_BASE_URL in .env.
 
Project Structure
telegram-admin/
├─ .env.example
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ postcss.config.js
├─ tailwind.config.js
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ lib/
   │  ├─ api.ts
   │  ├─ auth.ts
   │  └─ storage.ts
   ├─ components/
   │  ├─ Layout.tsx
   │  ├─ Nav.tsx
   │  ├─ Protected.tsx
   │  ├─ Table.tsx
   │  ├─ Modal.tsx
   │  └─ forms/
   │     ├─ BlockForm.tsx
   │     └─ LoginForm.tsx
   ├─ pages/
   │  ├─ LoginPage.tsx
   │  ├─ Dashboard.tsx
   │  ├─ BlocksPage.tsx
   │  ├─ UsersPage.tsx
   │  └─ SearchStatsPage.tsx
   ├─ services/
   │  ├─ auth.service.ts
   │  ├─ blocks.service.ts
   │  ├─ stats.service.ts
   │  └─ users.service.ts
   └─ types/
      ├─ auth.ts
      ├─ blocks.ts
      └─ stats.ts
 

------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
