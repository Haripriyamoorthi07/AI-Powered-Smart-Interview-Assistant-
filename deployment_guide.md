# Deployment Guide - AI Powered Smart Interview Assistant

This guide explains how to deploy the full-stack **AI Powered Smart Interview Assistant** application to the cloud for free.

---

## Architecture Overview
For a production deployment, we will separate the components:
1. **Database**: Hosted on **MongoDB Atlas** (Cloud Database - Free Tier)
2. **Backend**: Hosted on **Render** (Web Service - Free Tier)
3. **Frontend**: Hosted on **Vercel** or **Render** (Static Site - Free Tier)

---

## Step 1: Database Setup (MongoDB Atlas)

To replace your local database with a cloud database, create a free database cluster on MongoDB Atlas:

1. Sign up/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project, then click **Create Database** and select the **M0 Free Tier** cluster.
3. Set your username and password under **Database Access** (write these down).
4. Under **Network Access**, add IP address `0.0.0.0/0` to allow connection requests from the web host (Render).
5. Go to your cluster dashboard, click **Connect**, select **Drivers**, and copy the connection string.
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your created database credentials.

---

## Step 2: Push Your Project to GitHub

Both Render and Vercel sync directly with GitHub to automate builds:

1. Create a new repository on [GitHub](https://github.com/) named `ai-interview-assistant`.
2. Initialize Git in your project folder and push it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of interview assistant"
   git branch -M main
   git remote add origin https://github.com/your-username/ai-interview-assistant.git
   git push -u origin main
   ```

---

## Step 3: Deploy the Backend on Render

1. Sign up/Log in to [Render](https://render.com/).
2. Click **New > Web Service**.
3. Connect your GitHub account and select your `ai-interview-assistant` repository.
4. Configure the Web Service settings:
   - **Name**: `interview-assistant-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Select **Free**
5. Click **Advanced** and add the following **Environment Variables**:
   - `PORT` = `10000` (Render default)
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `[Generate a random long secret key]`
   - `MONGODB_URI` = `[Your MongoDB Atlas connection string from Step 1]`
   - `GEMINI_API_KEY` = `[Your official Google Gemini API Key]`
6. Click **Create Web Service**. Wait for it to build. Once complete, copy the service URL (e.g., `https://interview-assistant-api.onrender.com`).

---

## Step 4: Deploy the Frontend on Vercel

Vercel is the fastest platform to host static React/Vite websites:

1. Sign up/Log in to [Vercel](https://vercel.com/) (using your GitHub account).
2. Click **Add New > Project**.
3. Select your `ai-interview-assistant` repository.
4. Configure Vercel build settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `[Your Render Backend URL from Step 3]` (e.g. `https://interview-assistant-api.onrender.com`)
6. Click **Deploy**. Vercel will build and give you a public URL (e.g., `https://ai-interview-assistant.vercel.app`).

---

## Step 5: Configure Cors (Cross-Origin Resource Sharing)

Once you have your frontend URL from Vercel:
1. Open `backend/server.js` or configure the backend Environment Variable:
   - Make sure CORS is configured to accept requests from your Vercel URL.
2. In your React frontend code, ensure API calls are directed to the Render backend service URL.
