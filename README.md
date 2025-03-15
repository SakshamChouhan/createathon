# Createathon Project Setup

This guide will help you set up the Createathon project, including backend and frontend installation, PostgreSQL configuration, and Telegram bot integration.

## 1. Clone the Repository

```bash
git clone https://github.com/SakshamChouhan/createathon.git
cd createathon
```

## 2. Backend Setup

### 2.1 Navigate to the Backend Directory
```bash
cd backend
```

### 2.2 Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2.3 Set Up PostgreSQL Database
1. Install PostgreSQL if not already installed.
2. Create a new database:
   ```sql
   CREATE DATABASE createathon;
   CREATE USER your_db_user WITH PASSWORD 'your_db_password';
   ALTER ROLE your_db_user SET client_encoding TO 'utf8';
   ALTER ROLE your_db_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE your_db_user SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE createathon TO your_db_user;
   ```

### 2.4 Configure Environment Variables
Create a `.env` file in the `backend` directory and add:
```env
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
SECRET_KEY=<your_django_secret_key>
DEBUG=True
DB_NAME=your_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
```

### 2.5 Apply Migrations and Start the Server
```bash
python manage.py migrate
python manage.py runserver
```

## 3. Frontend Setup

### 3.1 Navigate to the Frontend Directory
```bash
cd ../frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start the Frontend Server
```bash
npm run dev
```

## 4. Setting Up Telegram Bot with Ngrok

### 4.1 Start Django Server
```bash
python manage.py runserver
```

### 4.2 Install and Start Ngrok
```bash
npm install -g ngrok  # Or download from https://ngrok.com/download
ngrok http 8000
```
Copy the generated HTTPS URL (e.g., `https://random.ngrok.io`).

### 4.3 Set Telegram Webhook
```bash
curl -X POST "https://api.telegram.org/bot<your_telegram_bot_token>/setWebhook?url=https://random.ngrok.io/telegram/webhook/"
```
Replace `<your_telegram_bot_token>` with your actual token and `https://random.ngrok.io` with the ngrok URL.

## 5. Running FastAPI Microservice
Navigate to the FastAPI directory and run:
```bash
cd createathon-backend/fastapi
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## 6. Start Everything Together
1. Start PostgreSQL
2. Run the Django server (`python manage.py runserver`)
3. Start Ngrok (`ngrok http 8000`)
4. Run the FastAPI microservice (`uvicorn main:app --host 0.0.0.0 --port 8001 --reload`)
5. Start the frontend (`npm run dev`)


