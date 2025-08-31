#!/bin/bash

echo "🚀 Setting up Real Estate MVP Development Environment..."

# Navigate to workspace
cd /workspaces/real-estate-mvp

# Create extension persistence directory
mkdir -p .devcontainer/vscode-extensions

# Install dependencies for admin panel
echo "📦 Installing admin panel dependencies..."
cd admin-panel
npm install
cd ..

# Install dependencies for mobile app
echo "📱 Installing mobile app dependencies..."
cd mobile-app
npm install
cd ..

# Copy environment files if they don't exist
echo "🔧 Setting up environment files..."
if [ ! -f "admin-panel/.env" ]; then
    cp admin-panel/.env.example admin-panel/.env
    echo "✅ Created admin-panel/.env from example"
fi

if [ ! -f "mobile-app/.env" ]; then
    cp mobile-app/.env.example mobile-app/.env
    echo "✅ Created mobile-app/.env from example"
fi

# Set up Git hooks (optional)
echo "🔗 Setting up Git hooks..."
if [ ! -f ".git/hooks/pre-commit" ]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run ESLint on staged files
echo "Running ESLint on staged files..."

# Get list of staged JavaScript/TypeScript files
staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')

if [ -n "$staged_files" ]; then
    # Check admin panel files
    admin_files=$(echo "$staged_files" | grep "^admin-panel/" || true)
    if [ -n "$admin_files" ]; then
        echo "Linting admin panel files..."
        cd admin-panel && npx eslint $admin_files && cd ..
    fi
    
    # Check mobile app files
    mobile_files=$(echo "$staged_files" | grep "^mobile-app/" || true)
    if [ -n "$mobile_files" ]; then
        echo "Linting mobile app files..."
        cd mobile-app && npx eslint $mobile_files && cd ..
    fi
fi
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Created pre-commit Git hook"
fi

# Create development scripts
echo "📝 Creating development helper scripts..."
cat > dev-admin.sh << 'EOF'
#!/bin/bash
echo "🖥️ Starting Admin Panel Development Server..."
cd admin-panel
npm start
EOF
chmod +x dev-admin.sh

cat > dev-mobile.sh << 'EOF'
#!/bin/bash
echo "📱 Starting Mobile App Development Server..."
cd mobile-app
npx react-native start
EOF
chmod +x dev-mobile.sh

cat > dev-firebase.sh << 'EOF'
#!/bin/bash
echo "🔥 Starting Firebase Emulators..."
firebase emulators:start --import=./firebase-export --export-on-exit
EOF
chmod +x dev-firebase.sh

cat > setup-firebase.sh << 'EOF'
#!/bin/bash
echo "🔥 Setting up Firebase..."
echo "1. Make sure you're logged in: firebase login"
echo "2. Initialize Firebase: firebase init"
echo "3. Select your project and configure Firestore, Hosting, and Storage"
echo "4. Deploy rules: firebase deploy --only firestore:rules,storage:rules"
echo ""
echo "For detailed instructions, check SETUP.md"
EOF
chmod +x setup-firebase.sh

# Create VS Code tasks
echo "⚙️ Setting up VS Code tasks..."
mkdir -p .vscode
cat > .vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Admin Panel",
            "type": "shell",
            "command": "./dev-admin.sh",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "problemMatcher": []
        },
        {
            "label": "Start Mobile App",
            "type": "shell",
            "command": "./dev-mobile.sh",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "problemMatcher": []
        },
        {
            "label": "Start Firebase Emulators",
            "type": "shell",
            "command": "./dev-firebase.sh",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "problemMatcher": []
        },
        {
            "label": "Install All Dependencies",
            "type": "shell",
            "command": "npm install",
            "options": {
                "cwd": "${workspaceFolder}/admin-panel"
            },
            "group": "build",
            "dependsOrder": "sequence",
            "dependsOn": [
                "Install Mobile Dependencies"
            ]
        },
        {
            "label": "Install Mobile Dependencies",
            "type": "shell",
            "command": "npm install",
            "options": {
                "cwd": "${workspaceFolder}/mobile-app"
            },
            "group": "build"
        }
    ]
}
EOF

# Create launch configurations for debugging
cat > .vscode/launch.json << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Admin Panel",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/admin-panel/node_modules/.bin/react-scripts",
            "args": ["start"],
            "cwd": "${workspaceFolder}/admin-panel",
            "env": {
                "NODE_ENV": "development"
            },
            "console": "integratedTerminal"
        },
        {
            "name": "Debug React Native",
            "type": "reactnative",
            "request": "launch",
            "platform": "android",
            "sourceMaps": true,
            "outDir": "${workspaceFolder}/mobile-app/.vscode/.react"
        }
    ]
}
EOF

# Show helpful information
echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. 🔧 Configure your .env files with Firebase and Google Maps credentials"
echo "2. 🔥 Run './setup-firebase.sh' for Firebase setup instructions"
echo "3. 🚀 Use VS Code tasks or run these commands:"
echo "   • ./dev-admin.sh     - Start admin panel"
echo "   • ./dev-mobile.sh    - Start mobile app"
echo "   • ./dev-firebase.sh  - Start Firebase emulators"
echo ""
echo "📖 Check SETUP.md for detailed configuration instructions"
echo "🏠 Happy coding with Real Estate MVP!"
echo ""

# Create a welcome message
cat > DEVCONTAINER_README.md << 'EOF'
# 🏠 Real Estate MVP - DevContainer

Welcome to the Real Estate MVP development environment! This devcontainer provides everything you need to start developing immediately.

## 🚀 Quick Start

### 1. Environment Setup
- **Admin Panel**: Configure `admin-panel/.env` with your Firebase credentials
- **Mobile App**: Configure `mobile-app/.env` with your Firebase and Google Maps credentials

### 2. Development Servers

Use VS Code tasks (Ctrl/Cmd + Shift + P → "Tasks: Run Task") or run directly:

```bash
# Start admin panel (React.js)
./dev-admin.sh

# Start mobile app (React Native Metro)
./dev-mobile.sh

# Start Firebase emulators
./dev-firebase.sh
```

### 3. Port Forwarding
- **3000**: Admin Panel development server
- **8081**: React Native Metro bundler
- **9090**: Firebase Emulator UI
- **9099**: Firebase Auth emulator
- **8080**: Firestore emulator
- **9199**: Firebase Storage emulator

## 🛠️ Available Tools

- **Node.js 18** with npm and yarn
- **React Native CLI** for mobile development
- **Firebase CLI** for backend services
- **ESLint & Prettier** for code quality
- **Git & GitHub CLI** for version control
- **VS Code Extensions** for enhanced development

## 📱 Mobile Development

Since this is a containerized environment, you'll need to:

1. **For Android**: Use an Android emulator on your host machine
2. **For iOS**: Use Xcode on your host Mac (macOS only)
3. **For testing**: Use the web-based React Native debugger

## 🔥 Firebase Setup

Run the setup helper:
```bash
./setup-firebase.sh
```

Or follow the detailed guide in `SETUP.md`.

## 📋 Development Workflow

1. **Code**: Edit files with full IntelliSense and debugging
2. **Test**: Run tests with `npm test` in respective directories
3. **Lint**: Code is auto-formatted on save
4. **Commit**: Pre-commit hooks ensure code quality
5. **Deploy**: Use GitHub Actions for CI/CD

## 🤝 Contributing

This devcontainer ensures all developers have the same environment, making collaboration seamless!

Happy coding! 🚀
EOF

echo "📖 Created DEVCONTAINER_README.md with helpful information"
