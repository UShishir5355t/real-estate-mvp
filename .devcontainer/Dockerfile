# Use the official Node.js LTS image as base
FROM mcr.microsoft.com/devcontainers/javascript-node:18-bullseye

# Install additional system dependencies for React Native and Firebase
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # Development tools
    curl \
    wget \
    git \
    vim \
    nano \
    unzip \
    # Build tools for native modules
    build-essential \
    python3 \
    python3-pip \
    # Java for Android development (optional)
    openjdk-11-jdk \
    # Android SDK tools (for React Native development)
    android-sdk \
    # Additional utilities
    tree \
    htop \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Switch to vscode user
USER vscode

# Set the working directory
WORKDIR /workspace

# Install global npm packages for development
RUN npm install -g \
    # React Native CLI
    @react-native-community/cli \
    # Firebase CLI
    firebase-tools \
    # Expo CLI (optional, for easier React Native development)
    @expo/cli \
    # Code quality tools
    eslint \
    prettier \
    typescript \
    # Testing tools
    jest \
    # Utilities
    nodemon \
    concurrently \
    npm-check-updates

# Install Yarn (alternative package manager)
RUN npm install -g yarn

# Create directories for caching
RUN mkdir -p /home/vscode/.npm-global \
    && mkdir -p /home/vscode/.cache \
    && mkdir -p /home/vscode/.local/share

# Set npm global directory
RUN npm config set prefix '/home/vscode/.npm-global'

# Add npm global bin to PATH
ENV PATH="/home/vscode/.npm-global/bin:$PATH"

# Configure Git (will be overridden by user's git config)
RUN git config --global --add safe.directory /workspace \
    && git config --global init.defaultBranch main

# Set up Oh My Zsh themes and plugins (will be installed by devcontainer features)
RUN echo 'export ZSH_THEME="robbyrussell"' >> /home/vscode/.zshrc \
    && echo 'plugins=(git node npm yarn firebase docker react-native)' >> /home/vscode/.zshrc

# Create workspace directory
RUN sudo mkdir -p /workspace && sudo chown vscode:vscode /workspace

# Expose ports for development servers
EXPOSE 3000 8081 9090 9099 8080 9199

# Set the default command
CMD ["sleep", "infinity"]
