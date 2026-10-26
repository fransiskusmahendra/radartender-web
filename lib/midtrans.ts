import crypto from "crypto";

const DEFAULT_SERVER_KEY = Buffer.from(
  "TWlkLXNlcnZlci1qS3JEMi1pN1BaM2s4QU1KQVFhbkxzN1g=",
  "base64"
).toString("utf-8");

const DEFAULT_CLIENT_KEY = Buffer.from(
  "TWlkLWNsaWVudC1CWG95ZWxKb2x3Y2s2RUJz",
  "base64"
).toString("utf-8");

export const MIDTRANS_SERVER_KEY =
  process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;

export const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || DEFAULT_CLIENT_KEY;

export const MIDTRANS_IS_PRODUCTION =
  process.env.MIDTRANS_IS_PRODUCTION === "true";

export const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export const MIDTRANS_SNAP_SCRIPT_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export interface CreateSnapParams {
  orderId: string;
  grossAmount: number;
  itemDetails?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
  customerDetails?: {
    firstName?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Buat transaksi Midtrans Snap token
 */
export async function createMidtransSnapTransaction(
  params: CreateSnapParams
): Promise<{ token: string; redirectUrl: string }> {
  const authHeader = `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`;

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: Math.round(params.grossAmount),
    },
    item_details: params.itemDetails,
    customer_details: params.customerDetails
      ? {
          first_name: params.customerDetails.firstName || "Kontraktor",
          email: params.customerDetails.email || "kontraktor@radartender.id",
          phone: params.customerDetails.phone || "",
        }
      : undefined,
    callbacks: {
      finish: "https://radartender.id?payment=success",
    },
  };

  const response = await fetch(MIDTRANS_SNAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    console.error("[Midtrans Error]", data);
    throw new Error(data.error_messages?.join(", ") || "Gagal membuat token Midtrans");
  }

  return {
    token: data.token,
    redirectUrl: data.redirect_url,
  };
}

/**
 * Verifikasi signature webhook dari Midtrans
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string
): boolean {
  try {
    const rawString = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
    const calculatedSignature = crypto
      .createHash("sha512")
      .update(rawString)
      .digest("hex");

    return calculatedSignature === receivedSignature;
  } catch (err) {
    console.error("[Midtrans Signature Error]", err);
    return false;
  }
}
