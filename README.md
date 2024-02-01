Just a place for me to play around with MongoDB


# Back End

## Install Dependencies and Run:

Ensure that you have all the necessary dependencies installed:
```bash
$ poetry install
```
Run the server from directory root:
```bash
$ poetry run uvicorn server:app --reload
```

# Front End

## Generate Client from Service OpenAPI:

Run the backend server:
```bash
$ poetry run uvicorn service:app --reload
```

Then generate the client (run from root of this project, not the client directory):
```bash
$ openapi-generator generate -i http://localhost:8000/openapi.json -g typescript-fetch -o my-places/src/api
```

## Install Dependencies and Run:

Ensure that you have all the necessary dependencies installed:
```bash
$ cd my-places
$ npm install
```
Run the server from directory root:
```bash
$ npm run start
```