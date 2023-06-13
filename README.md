# 25.1-SchoolManagement

School Management API system. 25.1 and 25.2 pre-project.

Dependencies installed: (use --save-dev to add to devDependencies)

- .gitignore - node.
- readme - created
- npm git init

        - Package name.
        - version 1.0.0
        - description 1.0.0

- Express : npm i express
- @types Express : npm i @types/express --save-dev

- Typescript : npm i typescript --save-dev

        - Tsconfig: npx tsc --init (!Requires typescript installed globally)
        - npx tsc --init (!temp install)

- Node : npm i ts-node-dev --save-dev
- @types Node: npm i @types/node --save-dev

- CORS : npm i cors
- @types cors : npm i @types/cors --save-dev (!allows connection of API from distinct URL environments)

- Mongoose : npm i mongoose
- @types Mongoose\* : npm i @types/mongoose --save-dev (!NOTE - Mongoose types depreciated?).

- Husky : npx husky-init && npm install (install with #bash)
- add npm run precommit to run lint and build.

  ***

- ESLint : npm init @eslint/config
- Prettier : .prettierrc

  Rules:

        {
        "singleQuote": false,
        "tabWidth": 2,
        "arrowParens": "always",
        "proseWrap": "never",
        "singleAttributePerLine": false,
        "quoteProps": "consistent",
        "semi": true,
        "printWidth": 600
        }

  ***

TSConfig mods to turn on:

// For swagger use:

    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

// Compilation folder - change

    "outDir": "./" ==> "outDir": "./dist",

// Others

    "removeComments": true,
    "strictPropertyInitialization": true, // for using schemas.
    "sourceMap": true,  // makes debugging easier.

// Don't forget to add:

    "include" : ["src/**/*ts", "__tests__/**/*.ts", "__tests__/*.ts"],
    "exclude" : ["dist/*"]

---

Scripts to use:

- Start = use to start localhost server
- Start:pro = use to run build and start production server. (! DON'T FORGET TO ADD "npm run build")

  "start": "ts-node-dev --inspect -- ./src/index.ts", "start:pro": "node ./dist/src/index.js",
