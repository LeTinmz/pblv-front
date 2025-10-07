# Image Node avec Yarn
FROM node:20-alpine

WORKDIR /app

# Copier package.json
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port de Metro bundler
EXPOSE 19006

# Commande pour lancer le bundler
CMD ["npm", "start"]