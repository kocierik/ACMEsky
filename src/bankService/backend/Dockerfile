# Usa un'immagine di Node.js come base
FROM node:21-alpine

# Imposta la directory di lavoro nell'immagine
WORKDIR /app

# Copia i file del package.json e del package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install 

# Copia i file di configurazione
COPY tsconfig.json ./
COPY index.ts .

# Compila i file TypeScript
RUN npm run build

# Esponi la porta su cui il server Node.js sta ascoltando (la porta predefinita è 3000)
EXPOSE 3000

# Comando di avvio predefinito per il container
CMD ["node", "dist/index.js"]
