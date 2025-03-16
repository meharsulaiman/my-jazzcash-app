// ---------- SERVER ACTIONS ----------
// app/actions/payment.ts
"use server";

import crypto from "crypto";

export type PaymentFormData = {
  amount: string;
  billRef: string;
  productDescription: string;
  customerEmail: string;
  customerMobile: string;
};

// hashdata type
export type HashData = {
  pp_Amount: number;
  pp_BillReference: string;
  pp_Description: string;
  pp_Language: string;
  pp_MerchantID: string;
  pp_Password: string;
  pp_ReturnURL: string;
  pp_TxnCurrency: string;
  pp_TxnDateTime: string;
  pp_TxnExpiryDateTime: string;
  pp_TxnRefNo: string;
  pp_Version: string;
  pp_TxnType?: string;
  ppmpf_1: string;
  ppmpf_2: string;
  ppmpf_3?: string;
  ppmpf_4?: string;
  ppmpf_5?: string;
};

export async function createJazzCashPayment(formData: PaymentFormData) {
  try {
    // Environment variables
    const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
    const password = process.env.JAZZCASH_PASSWORD!;
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;
    const isTestMode = process.env.NODE_ENV !== "production";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // Create a unique transaction ID
    const txnId = `T${Date.now()}`;

    // Create expiry timestamp (30 minutes from now)
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    const expiry = date
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);

    // Get current date time in required format
    const txnDateTime = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);

    // Amount in smallest currency unit (paisa)
    const amountInPaisa = Math.round(parseFloat(formData.amount) * 100);

    // Prepare data for hash creation
    const hashData: HashData = {
      pp_Amount: amountInPaisa,
      pp_BillReference: formData.billRef,
      pp_Description: formData.productDescription,
      pp_Language: "EN",
      pp_MerchantID: merchantId,
      pp_Password: password,
      pp_ReturnURL: `${appUrl}/api/jazzcash/callback`,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_TxnExpiryDateTime: expiry,
      pp_TxnRefNo: txnId,
      pp_Version: "1.1",
      ppmpf_1: formData.customerEmail || "",
      ppmpf_2: formData.customerMobile || "",
    };

    // Add test mode parameters if needed
    if (isTestMode) {
      hashData.pp_TxnType = "";
      hashData.ppmpf_3 = "";
      hashData.ppmpf_4 = "";
      hashData.ppmpf_5 = "";
    }

    // Create sorted string for hash
    let hashString = "";
    Object.keys(hashData)
      .sort()
      .forEach((key) => {
        hashString += `&${key}=${hashData[key as keyof HashData]}`;
      });

    // Add integrity salt and create hash
    hashString = integritySalt + hashString;
    const hash = crypto
      .createHmac("sha256", integritySalt)
      .update(hashString)
      .digest("hex");

    // Final payment data
    const paymentData = {
      ...hashData,
      pp_SecureHash: hash,
    };

    // Store transaction details in your database here
    // This would typically be a database operation to MongoDB or any DB of your choice

    // Return payment data and URL
    return {
      success: true,
      paymentData,
      paymentUrl: isTestMode
        ? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"
        : "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform",
    };
  } catch (error) {
    console.error("JazzCash payment creation error:", error);
    return {
      success: false,
      message: "Payment initiation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
