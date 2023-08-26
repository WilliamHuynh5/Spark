
[![Backend Tests](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/backend-tests.yml)
[![Frontend Lint](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/frontend-lint.yml/badge.svg)](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/frontend-lint.yml)
[![Frontend Type Check](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/frontend-type-check.yml/badge.svg)](https://github.com/unsw-cse-comp3900-9900-23T2/capstone-project-3900w09ateam/actions/workflows/frontend-type-check.yml)

# Society Management 
This is an application to help organisation manage user created clubs, events, posts, and user permissions. For more information on the features and functionalities checkout our system proposal [here](https://docs.google.com/document/d/149ObJDNKVHwBXavTiCRv5HezPljCvIF-5XNtJMOkFXM/edit?usp=sharing).

## Getting Started

### Setup

Note: If using the CSE machine to run the servers, you will need to run `1531 setup && . ~/.bashrc` and open up a new shell session before doing anything else. This is to ensure that the version of `node` and `npm` are correct (CSE defaults are outdated).

`node --version` should output `v18.16.0` or later.
`npm --version` should output `9.5.1` or later.

**Option 1**

Use the setup script:

```
sh setup.sh
```

**Option 2**

See `backend/README.md` and `frontend/README.md` for individual installation instructions.

### Running

This monorepo contains both the frontend and backend servers required for running this project. Each server needs to be run in separate shells. The instructions for each server can be found in `backend/README.md` and `frontend/README.md`.

## Package Copyrights
This application uses the below packages with the specified licenses.

- [dotenv](https://github.com/motdotla/dotenv/blob/master/LICENSE): Copyright (c) 2015, Scott Motte. All rights reserved.
- [Prisma](https://github.com/prisma/prisma/blob/main/LICENSE): Copyright (c) 2019, Prisma Labs, Inc. All rights reserved.
- [TypeScript](https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt): Copyright (c) 2014, Microsoft. All rights reserved.
- [Favicon](https://favicon.io/emoji-favicons/sparkles): 2728.svg
  - Copyright 2020 Twitter, Inc and other contributors (https://github.com/twitter/twemoji)
  - Graphics Source: https://github.com/twitter/twemoji/blob/master/assets/svg/2728.svg
  - Graphics License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

---

This readme was written in reference to this [article](https://media.csesoc.org.au/getting-that-grad-intern-role/).
