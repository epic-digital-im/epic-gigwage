import { Router } from 'express';
import GigwageService from '../src/gigwage';

const route = Router();

export default (app: any) => {

  const gigwageService = new GigwageService({
    config: {
      apiKey: 'YOUR_API_KEY',
      apiSecret: 'YOUR_API_SECRET',
      apiEnvironment: 'sandbox',
    },
  });

  app.use('/webhook', route);

  // GW uses a different URL for each Webhook Subscription
  const gw_types = ['payment', 'tin_check', 'partner_sign_up', '1099'];

  gw_types.forEach((gw_type) => {
    route.post(
      `/gigwage/${gw_type}`,
      gigwageService.bodyParser(),
      gigwageService.validateWebhook(),
      async (request, response) => {
        try {
          // do something with the request, its been validated
          response.status(200).send(`I did it!`);
        } catch (err: any) {
          console.log(err);
          response.status(500).send(`Webhook Error: ${err.message}`);
          return;
        }
      },
    );
  });
};
