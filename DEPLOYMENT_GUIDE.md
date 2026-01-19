# Deployment Guide: Automated CI/CD

Great news! Your project is now configured for **automatic deployment**. 
Whenever you push changes to the `main` branch on GitHub, your website will automatically update.

## One-Time Setup Required

To enable this automation, you need to save a Firebase Key in your GitHub settings **once**.

### 1. Get the Key from Firebase
1.  Go to the [Firebase Console Service Accounts](https://console.firebase.google.com/project/visualinkafrica-76c43/settings/serviceaccounts/adminsdk).
2.  Click the **"Generate new private key"** button.
3.  Confirm by clicking **"Generate key"**.
4.  This will download a `.json` file to your computer.
5.  Open this file with any text editor (Notepad, VS Code) and **copy the entire contents**.

### 2. Save the Key in GitHub
1.  Go to your GitHub Repository: [https://github.com/zannyke/VISUALIN.AFRICA](https://github.com/zannyke/VISUALIN.AFRICA)
2.  Click on **Settings** (top right tab).
3.  In the left sidebar, click **Secrets and variables** > **Actions**.
4.  Click the green **"New repository secret"** button.
5.  **Name**: `FIREBASE_SERVICE_ACCOUNT_VISUALINKAFRICA_76C43`
    *(Copy this exact name)*
6.  **Secret**: Paste the content of the JSON file you copied.
7.  Click **Add secret**.

## How to Deploy Updates
From now on, you don't need to run `firebase deploy` manually. Just save your work to GitHub:

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

GitHub will detect the push, build your site, and deploy it to Firebase automatically!
