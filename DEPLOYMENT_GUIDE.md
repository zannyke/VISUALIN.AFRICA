# Deployment Guide: Vercel

You have chosen **Vercel** for hosting. This is an excellent choice for React/Vite applications because it offers zero-configuration deployment and automatic previews.

## 1. Connect Vercel to GitHub (Recommended)

This is the easiest method. It ensures your site updates automatically whenever you push code to GitHub.

1.  **Push your latest code to GitHub** (if you haven't already):
    ```bash
    git add .
    git commit -m "Ready for Vercel"
    git push origin main
    ```

2.  **Go to Vercel Dashboard**:
    *   Log in to [vercel.com](https://vercel.com).

3.  **Add New Project**:
    *   Click **"Add New..."** button -> **"Project"**.
    *   Select **"Import Git Repository"**.
    *   Find your repo `zannyke/VISUALIN.AFRICA` and click **"Import"**.

4.  **Configure Project**:
    *   **Framework Preset**: It should automatically detect `Vite`.
    *   **Root Directory**: `./` (Default).
    *   **Build Command**: `npm run build` (Default).
    *   **Output Directory**: `dist` (Default).
    *   **Environment Variables**: None needed for now.

5.  **Deploy**:
    *   Click **"Deploy"**.
    *   Vercel will build your site and give you a live URL (e.g., `visualink-africa.vercel.app`).

## 2. Connect Your Custom Domain

Once your site is live on Vercel:

1.  Go to your **Project Settings** on Vercel.
2.  Click **Domains** in the sidebar.
3.  Enter your domain: `visualinkafrica.com`.
4.  Vercel will check the DNS configuration.
5.  **Configure DNS**: Vercel will give you a **A Record** (76.76.21.21) or **CNAME** to add to your domain registrar (where you bought the domain).
6.  Once added, Vercel will automatically generate an SSL certificate, and your site will be live at `visualinkafrica.com`!

## Manual Deployment (CLI)

If you prefer to deploy from your terminal without connecting GitHub:
1.  `npm install -g vercel`
2.  `vercel login`
3.  `vercel` (and follow the prompts)
