# Setup Instructions for Agent Auth System

## Prerequisites

### Install Node.js

1. **Download Node.js**:
   - Go to [https://nodejs.org](https://nodejs.org)
   - Download the LTS version (recommended)
   - Choose the Windows Installer (.msi)

2. **Install Node.js**:
   - Run the downloaded installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" during installation
   - Restart your terminal/command prompt after installation

3. **Verify Installation**:
   ```cmd
   node --version
   npm --version
   ```

## Running the Agent Auth System

### Option 1: Using PowerShell/Command Prompt

1. **Open PowerShell or Command Prompt**
2. **Navigate to the project directory**:
   ```cmd
   cd C:\Users\cheng\Desktop\pv
   ```

3. **Install dependencies**:
   ```cmd
   npm install
   ```

4. **Start the server**:
   ```cmd
   npm start
   ```

5. **Open your browser** and go to `http://localhost:3000`

### Option 2: Using VS Code Terminal

1. **Open the project in VS Code**
2. **Open the integrated terminal** (Ctrl + `)
3. **Run the commands**:
   ```bash
   npm install
   npm start
   ```

## Demo Accounts

Once the server is running, you can login with these demo accounts:

- **Username**: `admin` **Password**: `password123` (Tax department)
- **Username**: `user1` **Password**: `mypassword` (Insurance company)

## What You'll See

1. **Home Page**: Welcome page with navigation options
2. **Companies Page**: List of organizations using the system
3. **Login Page**: Authentication form
4. **Dashboard**: Shows your current time-based key (changes every 30 seconds)
5. **Verify Page**: Public page to verify anyone's key

## Troubleshooting

### If npm is not recognized:
1. Restart your terminal
2. Make sure Node.js was installed correctly
3. Add Node.js to your PATH manually if needed

### If port 3000 is busy:
- The app will automatically try other ports
- Or modify the PORT in server.js

### If dependencies fail to install:
- Try running as administrator
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and try again

## File Structure

```
pv/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── views/                 # EJS templates
│   ├── dashboard.ejs     # User dashboard
│   ├── companies.ejs     # Companies listing
│   ├── index.ejs         # Home page
│   ├── login.ejs         # Login page
│   └── verify.ejs        # Verification page
├── README.md             # Main documentation
└── SETUP_INSTRUCTIONS.md # This file
```

## Next Steps

After getting the system running:

1. **Test the login** with demo accounts
2. **View companies** on the companies page
3. **View your time-based key** on the dashboard
4. **Test verification** by copying a key and verifying it
5. **Watch the key change** every 30 seconds

## Development Mode

For development with auto-restart on file changes:

```cmd
npm install -g nodemon
npm run dev
``` 