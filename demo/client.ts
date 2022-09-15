import GigwageService, { Contractor, Subscription } from '../src/gigwage';

const gigwageService = new GigwageService({
  config: {
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET',
    apiEnvironment: 'sandbox',
  },
});

/* Exposes axsios requests:
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