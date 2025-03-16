// app/page.tsx
import { PaymentForm } from "@/components/payment-form";

export default function HomePage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        JazzCash Payment Demo
      </h1>
      <PaymentForm />
    </main>
  );
}
