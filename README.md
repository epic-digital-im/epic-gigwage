<p align="center">
 <img width="100px" src="https://raw.githubusercontent.com/epicdigitalmedia/epic-ts-npm-boilerplate/main/.github/images/favicon512x512-npm.png" align="center" alt=":package: epic-ts-npm-boilerplate" />
 <h2 align="center">:package: @epicdm/gigwage</h2>
 <p align="center">TypeScript Gigwage Client API and Express Middleware</p>
  <p align="center">
    <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/epicdigitalmedia/epic-ts-npm-boilerplate?style=flat&color=336791" />
    </a>
    <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/epicdigitalmedia/epic-ts-npm-boilerplate?style=flat&color=336791" />
    </a>
     <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate">
      <img alt="GitHub Downloads" src="https://img.shields.io/npm/dw/epic-ts-npm-boilerplate?style=flat&color=336791" />
    </a>
    <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate">
      <img alt="GitHub Total Downloads" src="https://img.shields.io/npm/dt/epic-ts-npm-boilerplate?color=336791&label=Total%20downloads" />
    </a>
 <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate">
      <img alt="GitHub release" src="https://img.shields.io/github/release/epicdigitalmedia/epic-ts-npm-boilerplate.svg?style=flat&color=336791" />
    </a>
    <br />
    <br />
  <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate/issues/new/choose">Report Bug</a>
  <a href="https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate/issues/new/choose">Request Feature</a>
  </p>

<p align="center"><strong>Typescript Gigwage Client w/ Express Middelware for validating incoming webhooks</strong> 🚀</p>

# Beta - Currently in Development
Not all methods implemented yet.  Please check back soon.

# Installation
```bash 
yarn add @epicdm/gigwage
npm install @epicdm/gigwage
```

# See Gigwage Developer Documentation
- https://developers.gigwage.com/docs
- https://developers.gigwage.com/reference

# API Client usage, see [examples](https://github.com/epicdigitalmedia/epic-gigwage/tree/main/demo)

```javascript 
import GigwageService, { Contractor, Subscription } from '../src/gigwage';

const gigwageService = new GigwageService({
  config: {
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
    apiEnvironment: 'sandbox',
  },
});

/* Exposes signed axios request methods:
  gigwageService.get
  gigwageService.post
  gigwageService.put
  gigwageService.patch
  gigwageService.del
*/

gigwageService.get<{ contractors: [] }>("api/v1/contractors").then((response) => {
  const contractors = response.data.contractors;
});

gigwageService.post<{ contractor: Contractor }>("api/v1/contractors", {
  contractor: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
  }
}).then((response) => {
  const contractor = response.data.contractor;
});

// Reactivate Subscription
gigwageService.put<{ subscription: Subscription }>(`api/v1/subscriptions/13`).then((response) => {
  const subscription = response.data.subscription;
});

// Delete Subscription
gigwageService.del<{ subscription: Subscription }>(`api/v1/subscriptions/13`).then((response) => {
  const subscription = response.data.subscription;
});  
```

# Express Middleware Usage, see [examples](https://github.com/epicdigitalmedia/epic-gigwage/tree/main/demo)

```javascript 
route.post(
  `/gigwage/payment`,
  gigwageService.bodyParser(), // need raw and JSON body
  gigwageService.validateWebhook(), // validate webhook signature
  async (request, response) => {
    try {
      // do something with the request, its been validated
      response.status(200).send(`I did it!`);
    } catch (err: any) {
      console.log(err);
      response.status(500).send(`Webhook Error`);
      return;
    }
  },
);
```

# Development Getting started

## Installation

> Clone this repository: 
```bash 
git clone https://github.com/epicdigitalmedia/epic-ts-npm-boilerplate
```
### Open the directory and run the script line:

```bash
cd epic-ts-npm-boilerplate 
```
```bash
yarn # or npm i
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](issues).

## Show your support

Give a ⭐️ if this project helped you!

[![codecov](https://codecov.io/gh/epicdigitalmedia/epic-ts-npm-boilerplate/branch/main/graph/badge.svg?token=Q9fr548J0D)](https://codecov.io/gh/epicdigitalmedia/epic-ts-npm-boilerplate)

## 📝 License

Copyright © 2022 [Epic Digital Interactive Media LLC](https://github.com/epicdigitalmedia).<br />
This project is [MIT](LICENSE) licensed.
