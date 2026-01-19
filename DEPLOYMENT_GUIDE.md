# Deployment Guide: GitHub & Firebase

## 1. Push Code to GitHub
I have already committed your changes locally. However, since I cannot authenticate with your GitHub account, you need to push the code manually.

Run this command in your terminal:
```bash
git push -u origin main
```
*If prompted, log in with your GitHub credentials.*

## 2. Deploy to Firebase Console (via GitHub Actions)

To automatically deploy to Firebase whenever you push to Git, follow these steps:

### Prerequisites
1.  You need a Firebase project created in the [Firebase Console](https://console.firebase.google.com/).
2.  You need the Firebase CLI installed.

### Step-by-Step Setup

1.  **Install Firebase CLI** (if not already installed):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Firebase in your project**:
    ```bash
    firebase init hosting
    ```
    *   **Select your project**: Choose "Use an existing project" and select your Firebase project.
    *   **Public directory**: Type `dist` (since this is a Vite app).
    *   **Configure as a single-page app**: Type `Yes` (Important for React Router).
    *   **Set up automatic builds and deploys with GitHub**: Type `Yes`.
    *   **Overwrite index.html?**: Type `No` (Do NOT overwrite).

    When asked about GitHub:
    *   It will ask you to log in to GitHub.
    *   It will ask for your repository format (e.g., `zannyke/VISUALIN.AFRICA`).
    *   It will create the necessary GitHub Action workflow files (`.github/workflows/firebase-hosting-merge.yml`, etc.).

4.  **Final Push**:
    Once the initialization is done, Firebase creates new files. Push them to GitHub:
    ```bash
    git add .
    git commit -m "Set up Firebase hosting with GitHub Actions"
    git push
    ```

### Manual Deployment (Alternative)
If you just want to deploy right now without GitHub Actions:
```bash
npm run build
firebase deploy
```
