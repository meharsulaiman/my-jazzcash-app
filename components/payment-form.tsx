// app/components/ui/payment-form.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createJazzCashPayment, PaymentFormData } from "@/app/actions/payment";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  billRef: z.string().min(1, "Bill reference is required"),
  productDescription: z.string().min(1, "Product description is required"),
  customerEmail: z.string().email("Must be a valid email"),
  customerMobile: z
    .string()
    .regex(
      /^03\d{9}$/,
      "Must be a valid Pakistani mobile number (e.g., 03123456789)"
    ),
});

export function PaymentForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      billRef: "",
      productDescription: "",
      customerEmail: "",
      customerMobile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const paymentData: PaymentFormData = {
        amount: values.amount,
        billRef: values.billRef,
        productDescription: values.productDescription,
        customerEmail: values.customerEmail,
        customerMobile: values.customerMobile,
      };

      const result = await createJazzCashPayment(paymentData);

      if (result.success) {
        // Create and submit form to JazzCash
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.paymentUrl || "";

        // Add all payment data as hidden fields
        Object.entries(result.paymentData || {}).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(result.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        "Payment error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Pay with JazzCash</CardTitle>
        <CardDescription>
          Complete your payment securely with JazzCash
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (PKR)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bill reference" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product or service description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="03123456789" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be a valid Pakistani mobile number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
