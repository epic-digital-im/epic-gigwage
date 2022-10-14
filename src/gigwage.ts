import express from 'express';
import axios, { AxiosResponse, Method } from "axios";
import bodyParser from 'body-parser';
import CryptoJS from "crypto-js";

export declare type GigwageEnvironments = 'production' | 'sandbox';

export const ENVIRONMENTS: { [key: string]: string } = {
  production: 'https://api.gigwage.com',
  sandbox: 'https://api.sandbox.gigwage.com',
}

export interface IGigwageClientOptions {
  /**
   * The Gig Wage API environment.
   */
  apiEnvironment?: GigwageEnvironments;
  /**
   * Gig Wage API key
   *
   * Learn more about Gigwage API keys at https://developers.gigwage.com/#introduction
   */
  apiKey: string;
  /**
   * Gig Wage API Secret
   *
   * Learn more about Gig Wage API keys at https://developers.gigwage.com/#introduction
   */
  apiSecret: string;
  /**
   * *TESTING ONLY*
   *
   * When set, will override the apiEnvironment and use the provided base URL.
   *
   * Use pattern `https://www.gigwage.com`.
   *
   */
  baseUrl?: string;
}

export interface RequestPaging {
  page?: number;
  per_page?: number;
  offset?: number;
}

export interface ContractorRequest extends RequestPaging {
  q?: string;
}

export interface Contractor {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  external_id: string;
  has_ach: boolean;
  has_debit: boolean;
  invited_at: string;
  invitation_accepted_at: string;
  created_at: string;
  phone_number: string;
  birthdate: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  social_security: string;
}

export interface MetaData { [key: string]: string }

export interface LineItem {
  amount: number;
  job_id: string;
  external_id: string;
  reason: string;
  reimbursement: boolean;
  metadata: MetaData;
}

export interface PaymentPayload {
  nonce: string;
  contractor_id: number;
  external_id?: string;
  interchange?: 'true' | 'false' | null;
  debit_card?: 'true' | 'false' | null;
  line_items: LineItem[];
}

export interface PaymentRequest extends RequestPaging {
  contractor_id?: number;
  includes?: string;
}

export interface Payment {
  id: number;
  amount: number;
  line_items: LineItem[],
  contractor_id: number;
  contractor: Contractor;
  created_at: string;
  completed_at: string;
  status: string;
  external_id: string;
  metadata: MetaData;
  sender_fee: number;
  recipient_fee: number;
  net_deposit_amount: number;
}

export interface ErrorReponse {
  error: string;
  messages: [
    string[]
  ]
}

export interface Subscription {
  id: number;
  webhook_type: string;
  url: string;
  deactivated_at: string | null;
  created_at: string | null;
}

export interface Transaction {
  id: number;
  incoming: number;
  outgoing: number;
  status: string;
  description: string;
  created_at: string;
}

interface GenerateRequestHeadersOptions {
  apiSecret: string;
  method: string;
  endpoint: string;
  apiKey: string;
  data: any;
  testTimestamp?: string;
}

interface RawRequest extends express.Request {
  buf: Buffer;
}

type RequstParams = PaymentRequest | ContractorRequest;

export default class GigwageService {
  public request: <ResponseData>(endpoint: string, method: Method, body: any) => Promise<AxiosResponse<ResponseData, any>>;
  config: IGigwageClientOptions;

  constructor({ config }: { config: IGigwageClientOptions }) {
    this.config = config;
    this.request = this.createHttpClient(config);
  }

  private generateRequestHeaders({
    apiSecret,
    method,
    endpoint,
    apiKey,
    data,
    testTimestamp
  }: GenerateRequestHeadersOptions) {
    const timestamp = testTimestamp ? testTimestamp : new Date().getTime().toString();
    const stringifiedData = JSON.stringify(data);
    const payload = [
      timestamp,
      method,
      `/${endpoint.split('?')[0]}`,
      data ? stringifiedData : undefined,
    ].join('');

    const bytes = CryptoJS.HmacSHA256(payload, apiSecret);
    const signature = bytes.toString(CryptoJS.enc.Hex);
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Gw-Api-Key': apiKey,
      'X-Gw-Timestamp': timestamp,
      'X-Gw-Signature': signature,
    };
    return headers;
  }

  createHttpClient({ apiKey, apiEnvironment, apiSecret, baseUrl }: IGigwageClientOptions) {
    const env = apiEnvironment = (!apiEnvironment) ? 'production' : apiEnvironment;
    return async (endpoint: string, method?: Method, body?: any) => {
      const data = body ? JSON.stringify(body) : undefined;
      const url = "".concat(baseUrl ? baseUrl : ENVIRONMENTS[env]).concat(endpoint);
      const headers = this.generateRequestHeaders({
        apiSecret: apiSecret,
        method: method ? method : 'GET',
        endpoint: endpoint,
        apiKey: apiKey,
        data: body,
      });
      try {
        const response = await axios.request({ method, url: url, headers: headers, data });
        return response;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as any;
          return err.response;
        } else {
          const err = error as { message: string };
          throw new Error(err.message);
        }
      }
    };
  }

  public get<ResponseData>(url: string, params?: RequstParams) {
    const queryParams = new URLSearchParams(params);
    const queryString = `?${queryParams.toString()}`;
    return this.request<ResponseData>(params ? `${url}${queryString}` : url, 'GET', null);
  }
  public post<ResponseData>(url: string, body: any) {
    return this.request<ResponseData>(url, 'POST', body);
  }
  public patch<ResponseData>(url: string, body?: any) {
    return this.request<ResponseData>(url, 'PATCH', body);
  }
  public put<ResponseData>(url: string, body?: any) {
    return this.request<ResponseData>(url, 'PUT', body);
  }
  public del<ResponseData>(url: string, body?: any) {
    return this.request<ResponseData>(url, 'DELETE', body);
  }

  private verifySignature(payload: any, signature?: string | string[]): string {
    const decodedPayload = Buffer.isBuffer(payload)
      ? payload.toString('utf8')
      : payload;
    const bytes = CryptoJS.HmacSHA256(decodedPayload, this.config.apiSecret);
    const decodedSignature = bytes.toString(CryptoJS.enc.Hex);
    if (decodedSignature !== signature) {
      throw new Error('Invalid signature');
    }
    return decodedSignature;
  }

  public bodyParser() {
    return bodyParser.json({
      verify: (req: RawRequest, res: express.Response, buf: Buffer) => {
        req.buf = buf;
      },
    })
  }

  public validateWebhook() {
    return (req: RawRequest, res: express.Response, next: express.NextFunction) => {
      const signature = req.headers['x-gigwage-signature'];
      try {
        this.verifySignature(req.buf, signature);
        next();
      } catch (err) {
        res.status(401).send('Unauthorized');
      }
    }
  }

  public async listTransactions() {
    return this.get<{ current_balance: string, available_balance: string, transactions: Transaction[] }>("api/v1/ledger");
  }

  public async getContractors(params?: ContractorRequest) {
    return this.get<{ contractors: Contractor[] }>("api/v1/contractors", params);
  }

  public async createContractor(contractor: Partial<Contractor>) {
    return this.post<{ contractor: Contractor }>("api/v1/contractors", { contractor });
  }

  public async getPayments(params?: PaymentRequest) {
    return this.get<{ payments: Payment[] }>(`api/v1/payments`, params);
  }

  public async sendPayment(payment: PaymentPayload) {
    return this.post<{ payment: Payment }>("api/v1/payments", { payment });
  }

  public async createSubscription({ webhook_type, url }: { webhook_type: string, url: string }) {
    return this.post<{ subscription: Subscription }>(
      "api/v1/subscriptions",
      {
        subscription: {
          webhook_type,
          url,
        }
      },
    );
  }

  public async updateSubscription(id: number, { webhook_type, url }: Partial<Subscription>) {
    return this.patch<{ subscription: Subscription }>(
      `api/v1/subscriptions/${id}`,
      {
        subscription: {
          webhook_type,
          url,
        }
      },
    );
  }

  public async reactivateSubscription(id: number) {
    return this.put<{ subscription: Subscription }>(
      `api/v1/subscriptions/${id}`
    );
  }

  public async deleteSubscription(id: number) {
    return this.del<{ subscription: Subscription }>(
      `api/v1/subscriptions/${id}`
    );
  }

  public async listSubscriptions() {
    return this.get<{ subscriptions: Subscription[] }>("api/v1/subscriptions");
  }
}
