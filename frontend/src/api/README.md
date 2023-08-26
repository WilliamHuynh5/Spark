# API Documentation

This is the documentation for the `api` module the frontend uses to make requests to the backend server.

It aims to reduces the manual work for the backenders to maintain [API documentation](https://docs.google.com/document/d/1UkMrFTBK9eDqdz5ebFdRy_lRmpd15tBaIbcf-YrOoNw/edit?usp=sharing).

## Guide

You can view the documentation by openning the `./api-docs/index.html` file in your preferred web-browser.

You will need to manually regenerate documentation i.e.:

- Run `npm run typedoc` to generate the docs anytime you make a change to `./api` folder
- If **warnings** (yellow) show up, add to the `tsconfig.json` under `entryPoints` option
