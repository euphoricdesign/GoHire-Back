import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: 'TEST-2645491994986306-060612-bc53c7a7a78b3f301b30310ac4068618-1843561803',
});

const preference = new Preference(client);
const payment = new Payment(client);

export { preference, payment };
