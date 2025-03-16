// app/components/ui/payment-result.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PaymentResult({ success = false }) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const txnRef = searchParams.get("txnRef");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {success ? (
            <>
              <CheckCircle className="text-green-500" />
              Payment Successful
            </>
          ) : (
            <>
              <XCircle className="text-red-500" />
              Payment Failed
            </>
          )}
        </CardTitle>
        <CardDescription>
          {success
            ? "Your payment has been completed"
            : "There was an issue with your payment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant={success ? "default" : "destructive"}>
          <AlertTitle>{success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {message ||
              (success ? "Payment completed successfully" : "Payment failed")}
          </AlertDescription>
        </Alert>

        {txnRef && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-500">
              Transaction Reference
            </p>
            <p className="text-lg font-bold">{txnRef}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            Return to Homepage
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
