# 🐳 DevContainer for Real Estate MVP

This DevContainer provides a complete development environment for the Real Estate MVP project, ensuring consistency across all development machines.

## 🚀 Quick Start

### Prerequisites
- **VS Code** with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- **Docker Desktop** installed and running

### Getting Started
1. Clone the repository
2. Open in VS Code
3. Click "Reopen in Container" when prompted (or use Command Palette → "Dev Containers: Reopen in Container")
4. Wait for the container to build and setup to complete

## 🛠️ What's Included

### Development Environment
- **Ubuntu 22.04** (Bullseye) base image
- **Node.js 18 LTS** with npm and yarn
- **Python 3** for native module compilation
- **Java 11 JDK** for Android development tools
- **Git** with GitHub CLI
- **Oh My Zsh** with useful plugins

### Pre-installed Tools
- **React Native CLI** (`@react-native-community/cli`)
- **Firebase CLI** (`firebase-tools`)
- **Expo CLI** (`@expo/cli`) for easier React Native development
- **ESLint, Prettier, TypeScript** for code quality
- **Jest** for testing
- **Development utilities** (nodemon, concurrently, etc.)

### VS Code Extensions
The container automatically installs essential extensions:
- TypeScript/JavaScript support
- React Native development tools
- Firebase integration
- Git/GitHub tools
- Docker support
- Code quality tools (ESLint, Prettier)
- Markdown support

## 📁 Container Structure

```
/workspace/                    # Your project code
├── admin-panel/              # React.js admin interface
├── mobile-app/               # React Native mobile app
├── .devcontainer/            # Container configuration
└── ...

/home/vscode/                 # User home directory
├── .npm-global/              # Global npm packages
├── .cache/                   # Various caches
└── .vscode-server/           # VS Code server files
```

## 🔧 Configuration

### Environment Variables
The container sets up:
- `NODE_ENV=development`
- `WATCHPACK_POLLING=true` (for file watching in containers)
- `CHOKIDAR_USEPOLLING=true` (for React Native Metro)

### Port Forwarding
These ports are automatically forwarded:
- **3000**: Admin Panel development server
- **8081**: React Native Metro bundler
- **9090**: Firebase Emulator Suite UI
- **9099**: Firebase Auth emulator
- **8080**: Firestore emulator
- **9199**: Firebase Storage emulator

### Persistent Storage
The container uses volumes for:
- VS Code extensions (persisted across rebuilds)
- Node modules (faster rebuilds)
- Your source code (bind mounted)

## 🚀 Development Scripts

The post-creation script sets up helpful development scripts:

```bash
# Start admin panel development server
./dev-admin.sh

# Start React Native Metro bundler
./dev-mobile.sh

# Start Firebase emulators
./dev-firebase.sh

# Get Firebase setup instructions
./setup-firebase.sh
```

## ⚙️ VS Code Integration

### Tasks
Use Ctrl/Cmd + Shift + P → "Tasks: Run Task":
- **Start Admin Panel**: Launches the React.js development server
- **Start Mobile App**: Launches React Native Metro bundler
- **Start Firebase Emulators**: Runs Firebase emulator suite
- **Install All Dependencies**: Installs npm packages for both apps

### Debug Configurations
- **Debug Admin Panel**: Attach debugger to React development server
- **Debug React Native**: Debug React Native application

### Code Quality
- **Auto-formatting** on save with Prettier
- **ESLint** integration for code quality
- **Pre-commit hooks** for code quality checks
- **Auto-import** organization

## 📱 Mobile Development

Since containers can't directly run mobile emulators:

### Android Development
1. Install Android Studio on your host machine
2. Set up Android emulator or connect physical device
3. The Metro bundler (port 8081) will be accessible from your host

### iOS Development (macOS only)
1. Use Xcode on your host Mac
2. The Metro bundler will be available at localhost:8081

### Alternative: Expo Development
Use Expo for easier testing:
```bash
cd mobile-app
npx expo start
```
Then use Expo Go app on your phone.

## 🔥 Firebase Development

### Local Development
The container includes Firebase CLI for local development:

```bash
# Login to Firebase (run once)
firebase login

# Initialize Firebase project
firebase init

# Start emulators
firebase emulators:start
```

### Emulator Suite
Access the Firebase Emulator Suite UI at http://localhost:9090:
- **Authentication**: localhost:9099
- **Firestore**: localhost:8080
- **Storage**: localhost:9199

## 🐛 Troubleshooting

### Container Won't Start
1. Make sure Docker Desktop is running
2. Check available disk space
3. Try rebuilding: "Dev Containers: Rebuild Container"

### Port Already in Use
If ports 3000 or 8081 are busy on your host:
1. Stop other development servers
2. Or modify port forwarding in `devcontainer.json`

### Slow File Changes
If file changes aren't detected:
1. The container uses polling for file watching
2. This is normal in containerized environments
3. Changes may take a few seconds to reflect

### Permission Issues
The container runs as the `vscode` user:
- Files created in the container are owned by `vscode`
- This should match your host user permissions

## 🔧 Customization

### Adding More Tools
Edit `.devcontainer/Dockerfile` to add system packages:
```dockerfile
RUN apt-get update && apt-get install -y your-package
```

### Adding Node Packages
Edit `.devcontainer/Dockerfile` to add global npm packages:
```dockerfile
RUN npm install -g your-package
```

### VS Code Extensions
Add extensions to `.devcontainer/devcontainer.json`:
```json
"extensions": ["publisher.extension-name"]
```

### Environment Variables
Add environment variables in `devcontainer.json`:
```json
"containerEnv": {
  "YOUR_VAR": "your-value"
}
```

## 📊 Performance Tips

### Faster Builds
- Node modules are cached in Docker volumes
- VS Code extensions persist across rebuilds
- Use `.dockerignore` to exclude unnecessary files

### Memory Usage
- The container uses ~2GB RAM
- Adjust Docker Desktop memory limits if needed
- Close unused applications on your host

### Network Speed
- Container downloads packages on first build
- Subsequent builds use Docker layer caching
- Consider using npm/yarn offline mirrors for faster installs

## 🤝 Team Development

### Consistent Environment
- All developers get identical development setup
- No "works on my machine" issues
- Easy onboarding for new team members

### Sharing Changes
- Modify `.devcontainer/` files to change the environment
- Commit changes to share with the team
- Use `devcontainer.json` features for team-wide tools

## 📚 Additional Resources

- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/remote/containers)
- [DevContainer Specification](https://containers.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [React Native Development Environment](https://reactnative.dev/docs/environment-setup)
- [Firebase Local Development](https://firebase.google.com/docs/emulator-suite)

---

Happy coding in your containerized Real Estate MVP environment! 🏠🚀
