import { TransactionLedger, PayoutRecord, Booking } from '../types';

export interface PaymentIntent {
  intentId: string;
  bookingId: string;
  customerId: string;
  companionId: string;
  grossAmount: number;
  platformFee: number;
  providerFee: number;
  netAmount: number;
  currency: 'PKR';
  idempotencyKey: string;
  status: 'requires_payment' | 'processing' | 'succeeded' | 'failed';
  clientSecret: string;
  createdAt: string;
}

export interface PaymentMethodDetails {
  method: 'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer';
  accountRefMasked: string; // e.g. "0300****123" or "Card ending in 4242"
}

// Payment Provider Interface (enables swapping Stripe, JazzCash, EasyPaisa, PayFast)
export interface IPaymentProvider {
  name: string;
  createIntent(params: {
    bookingId: string;
    amount: number;
    currency: string;
    idempotencyKey: string;
  }): Promise<{ intentId: string; clientSecret: string }>;
  
  verifyWebhook(signature: string, payload: any): boolean;
  
  refund(transactionId: string, amount: number): Promise<{ success: boolean; refundId: string }>;
}

// Implementation of Mock Provider for local execution / development
class MockPakistanGatewayProvider implements IPaymentProvider {
  name = 'SecurePakistanGateway';

  async createIntent(params: {
    bookingId: string;
    amount: number;
    currency: string;
    idempotencyKey: string;
  }) {
    const intentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const clientSecret = `sec_${Math.random().toString(36).substring(2, 15)}`;
    return { intentId, clientSecret };
  }

  verifyWebhook(signature: string, payload: any): boolean {
    // In production, HMAC SHA256 verification of raw body with webhook secret
    return Boolean(signature && signature.startsWith('sig_mup_'));
  }

  async refund(transactionId: string, amount: number) {
    return {
      success: true,
      refundId: `ref_${Date.now()}_${transactionId.slice(-4)}`
    };
  }
}

export class PaymentService {
  private static provider: IPaymentProvider = new MockPakistanGatewayProvider();

  // Create payment intent server-side
  public static async createPaymentIntent(
    booking: Booking,
    platformFeePct: number,
    idempotencyKey?: string
  ): Promise<PaymentIntent> {
    const key = idempotencyKey || `idem_${booking.id}_${Date.now()}`;
    const grossAmount = booking.grossAmount;
    const platformFee = Math.round((grossAmount * platformFeePct) / 100);
    // Standard gateway interchange fee (approx 2% in Pakistan)
    const providerFee = Math.round(grossAmount * 0.02);
    const netAmount = grossAmount - platformFee;

    const { intentId, clientSecret } = await this.provider.createIntent({
      bookingId: booking.id,
      amount: grossAmount,
      currency: 'PKR',
      idempotencyKey: key
    });

    return {
      intentId,
      bookingId: booking.id,
      customerId: booking.customerId,
      companionId: booking.companionId,
      grossAmount,
      platformFee,
      providerFee,
      netAmount,
      currency: 'PKR',
      idempotencyKey: key,
      status: 'requires_payment',
      clientSecret,
      createdAt: new Date().toISOString()
    };
  }

  // Record successful server-verified transaction in ledger
  public static recordTransaction(
    intent: PaymentIntent,
    method: 'EasyPaisa' | 'JazzCash' | 'Card' | 'Bank Transfer'
  ): TransactionLedger {
    return {
      transaction_id: `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      booking_id: intent.bookingId,
      customer_id: intent.customerId,
      companion_id: intent.companionId,
      gross_amount: intent.grossAmount,
      platform_fee: intent.platformFee,
      provider_fee: intent.providerFee,
      net_amount: intent.netAmount,
      currency: 'PKR',
      payment_method: method,
      status: 'success',
      idempotency_key: intent.idempotencyKey,
      created_at: intent.createdAt,
      completed_at: new Date().toISOString()
    };
  }

  // Generate companion payout record
  public static createPayoutRecord(transaction: TransactionLedger): PayoutRecord {
    return {
      payout_id: `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      companion_id: transaction.companion_id,
      booking_id: transaction.booking_id,
      gross_amount: transaction.gross_amount,
      platform_fee: transaction.platform_fee,
      net_amount: transaction.net_amount,
      payout_status: 'Eligible',
      payout_method: transaction.payment_method === 'EasyPaisa' ? 'EasyPaisa Wallet' : 'Bank Transfer IBAN',
      account_title: 'Verified Companion',
      account_number_masked: '0301-*****92',
      created_at: new Date().toISOString()
    };
  }
}
