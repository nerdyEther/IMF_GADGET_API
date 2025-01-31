# IMF Gadget API - Project Setup Guide

## Prerequisites
- Node.js 
- A Neon Database account 
- Postman 

## Project Setup

### 1. Clone and Install Dependencies
```

# Install required dependencies
npm install @prisma/client cors dotenv express helmet jsonwebtoken
npm install --save-dev prisma nodemon
npm install
```

### 2. Project Structure
Create the following file structure:
```
imf-gadget-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── middlewares.js
│   ├── handlers.js
│   ├── utils.js
│   ├── routes.js
│   └── app.js
├── .env
├── .gitignore
└── package.json
```

### 3. Configure Environment
Create a `.env` file:
```
DATABASE_URL="neon-database-url"
JWT_SECRET="jwt-secret"
PORT=3000
```


### 4. Initialize Prisma

```
# Create Prisma schema
npx prisma init

# After adding schema content, generate client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init
```



### 5. Generate JWT Token


Run it to get your token:
```
node generateToken.js
```


### 6. Generate Test data
```

node testdata.js
```

### 7. Start the Server
```

npm run dev
```


