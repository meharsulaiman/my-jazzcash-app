// app/payment/failed/page.tsx
import { PaymentResult } from "@/components/payment-result";

export default function FailedPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Payment Result</h1>
      <PaymentResult success={false} />
    </main>
  );
}
