// app/api/jazzcash/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await request.json();

    // Verify the response hash to ensure it's from JazzCash
    // ... verification code here ...

    // Process based on pp_ResponseCode
    if (response.pp_ResponseCode === "000") {
      // Payment successful
      // Update order status in your database
      // ...

      // Redirect to success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?txnRef=${response.pp_TxnRefNo}`
      );
    } else {
      // Payment failed
      // Log failure reason
      console.log("Payment failed:", response.pp_ResponseMessage);

      // Redirect to failure page
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL
        }/payment/failed?message=${encodeURIComponent(
          response.pp_ResponseMessage
        )}`
      );
    }
  } catch (error) {
    console.error("JazzCash callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_APP_URL
      }/payment/failed?message=${encodeURIComponent("Processing Error")}`
    );
  }
}
