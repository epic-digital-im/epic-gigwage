<p align="center">
 <img width="100px" src="https://raw.githubusercontent.com/epicdigitalmedia/epic-gigwage/main/.github/images/favicon512x512-npm.png" align="center" alt=":package: epic-gigwage" />
 <img width="100px" src="https://avatars.githubusercontent.com/u/113625277?s=200&v=4" align="center" alt="Epic Digital Interactive Media LLC" />
 <h2 align="center">:package: @epicdm/gigwage</h2>
 <p align="center">TypeScript Gigwage Client API and Express Middleware</p>
  <p align="center">
    <a href="https://github.com/epicdigitalmedia/epic-gigwage/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/epicdigitalmedia/epic-gigwage?style=flat&color=336791" />
    </a>
    <a href="https://github.com/epicdigitalmedia/epic-gigwage/pulls">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/epicdigitalmedia/epic-gigwage?style=flat&color=336791" />
    </a>
     <a href="https://github.com/epicdigitalmedia/epic-gigwage">
      <img alt="GitHub Downloads" src="https://img.shields.io/npm/dw/@epicdm/gigwage?style=flat&color=336791" />
    </a>
    <a href="https://github.com/epicdigitalmedia/epic-gigwage">
      <img alt="GitHub Total Downloads" src="https://img.shields.io/npm/dt/@epicdm/gigwage?color=336791&label=Total%20downloads" />
    </a>
    <a href="https://github.com/epicdigitalmedia/epic-gigwage">
      <img alt="GitHub release" src="https://img.shields.io/github/release/epicdigitalmedia/epic-gigwage.svg?style=flat&color=336791" />
    </a>
    <br />
    <br />
  <a href="https://github.com/epicdigitalmedia/epic-gigwage/issues/new/choose">Report Bug</a>
  <a href="https://github.com/epicdigitalmedia/epic-gigwage/issues/new/choose">Request Feature</a>
  </p>

<p align="center"><strong>Typescript Gigwage Client w/ Express Middelware for validating incoming webhooks</strong> 🚀</p>

# Beta - Currently in Development
Adding convenience methods for certain endpoints, eg: listSubscriptions.  Not all methods implemented yet.  Please check back soon.

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

gigwageService.get<{ contractors: Contractor[] }>("api/v1/contractors")
  .then((response) => {
    const contractors = response.data.contractors;
  });

gigwageService.post<{ contractor: Contractor }>("api/v1/contractors", {
  contractor: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
  }
}).then((response) => {
  if (response.data.error) {
    /* Axios handled error, includes validation error response:
    {
      "error": "Validation Failed",
      "errors": [
        "Email missing",
      ]
    }
    */
  }
  const contractor = response.data.contractor;
});

// Reactivate Subscription
gigwageService.put<{ subscription: Subscription }>(`api/v1/subscriptions/13`)
  .then((response) => {
    const subscription = response.data.subscription;
  });

// Delete Subscription
gigwageService.del<{ subscription: Subscription }>(`api/v1/subscriptions/13`)
  .then((response) => {
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
git clone https://github.com/epicdigitalmedia/epic-gigwage
```
### Open the directory and run the script line:

```bash
cd epic-gigwage
```
```bash
yarn # or npm i
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](issues).

## Show your support

Give a ⭐️ if this project helped you!

[![codecov](https://codecov.io/gh/epicdigitalmedia/epic-gigwage/branch/main/graph/badge.svg?token=Q9fr548J0D)](https://codecov.io/gh/epicdigitalmedia/epic-gigwage)

## 📝 License

Copyright © 2022 [Epic Digital Interactive Media LLC](https://github.com/epicdigitalmedia).<br />
This project is [MIT](LICENSE) licensed.
