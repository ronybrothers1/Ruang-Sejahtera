export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';

export type CreatePaymentInput = {
  donationId: string;
  amount: number;
  currency: 'IDR';
  donorEmail?: string;
  returnUrl: string;
};

export type PaymentSession = {
  providerReference: string;
  status: PaymentStatus;
  checkoutUrl?: string;
  expiresAt?: string;
};

export type VerifiedWebhook = {
  providerReference: string;
  status: PaymentStatus;
  amount: number;
  currency: 'IDR';
  eventId: string;
};

export interface PaymentGatewayAdapter {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;
  verifyWebhook(rawBody: string, signature: string): Promise<VerifiedWebhook>;
}

export function assertValidDonationAmount(amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Nominal donasi tidak valid.');
}
