export type CheckoutField = "name" | "email" | "phone" | "address" | "city" | "state" | "postalCode";
export type CheckoutCustomer = Record<CheckoutField, string>;
export type PaymentMethod = "upi" | "card" | "cod";

export interface CheckoutDraft {
  customer: CheckoutCustomer;
  createdAt: string;
}

export interface DemoOrder {
  reference: string;
  total: number;
  customer: Pick<CheckoutCustomer, "name">;
  createdAt: string;
  demo: true;
  paymentMethod: PaymentMethod;
}

export const CHECKOUT_DRAFT_KEY = "swachetna-checkout-draft";
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit or debit card",
  cod: "Cash on delivery",
};
