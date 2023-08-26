## Getting Started

### Installation
First, ensure that your currency working directory is `frontend/``, i.e. from the root of the project:

```
$ cd frontend
```

Next step is to install the Node packages required to run the frontend.
```
$ npm ci
```


### Running

First ensure you are in the frontend/ folder on another shell session.

To build and run the server you can use:

```
$ npm run build && npm run preview
```

Once this command has run, it will output a URL to access the frontend.

If the above does not work, please try:

```
$ npm run start
```

Note: If you change the backend host/port from default, update those details in [frontend/src/config.json](src/config.json).


## FAQ

Why use `npm ci` rather than `npm i`?
- CI stands for clean installation, i.e. we can ensure the same dependencies and versions are installed (based on the `package-lock.json`).
- It is also faster as it doesn't have to check `node_modules` for existing packages.
- Read more [here](https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci).

What is the `preview` script in `package.json`?
- Preview serves a pre-built solution from the `.dist` folder (populated by `npm run build`).
- It may not be the most recent version of the application.
- For more script information see [here](https://stackoverflow.com/questions/71703933/what-is-the-difference-between-vite-and-vite-preview).

Why does `npm run lint` return a WARNING for typescript version? *Date: 20.06.2023*
- The [@typescript-eslint/typescript-estree](https://www.npmjs.com/package/@typescript-eslint/typescript-estree) package does not yet support [typescript 5.1.3](https://www.npmjs.com/package/typescript/v/5.1.3) which was released recently (*31.05.2023*).
- This package is non-critical (used for linting and code quality reasons) so the slight incongruity of the versions has been deemed a reasonable risk. On the other hand, downgrading Typescript will remove more critical type support and is an unecessary risk.
- This package is well-supported, so it's likely support for the newer version will come soon. 
