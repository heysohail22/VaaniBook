"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "@/components/branding/logo";
import { AgentStatus } from "@/components/agent/agent-status";
import { CustomerForm } from "@/components/booking/customer-form";
import { CallStatus, CallStage } from "@/components/agent/call-status";
import { GridPattern } from "@/components/magic/grid-pattern";

export default function Home() {
  const [stage, setStage] = useState<"form" | "connecting" | "calling" | "active" | "error">("form");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartCall = async (data: { customerName: string; phoneNumber: string }) => {
    setCustomerName(data.customerName);
    setPhoneNumber(data.phoneNumber);
    setIsLoading(true);
    setErrorMessage("");

    // Step 1: Connecting to booking agent
    setStage("connecting");

    // Short graceful interval to reflect workflow step progression (per spec Section 13)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Calling customer
    setStage("calling");

    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");

    try {
      const res = await fetch(`${backendUrl}/api/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.customerName,
          phone_number: data.phoneNumber,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Unable to trigger voice agent call");
      }

      // Small pause so the user perceives the connection before entering active state
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStage("active");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setErrorMessage(errorMsg);
      setStage("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStage("form");
    setErrorMessage("");
    setIsLoading(false);
  };

  const handleRetry = () => {
    if (customerName && phoneNumber) {
      handleStartCall({ customerName, phoneNumber });
    } else {
      handleReset();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#09090B] text-[#F4F4F5] flex flex-col justify-between overflow-x-hidden selection:bg-[#5EEAD4]/20 selection:text-[#5EEAD4]">
      {/* Background Radial Light (per spec Section 15) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 12%, rgba(45, 212, 191, 0.08), transparent 70%), #09090B",
        }}
      />

      {/* Magic UI Ambient Grid Pattern */}
      <GridPattern
        width={36}
        height={36}
        x={-1}
        y={-1}
        className="z-0"
      />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-[#27272A]/40 bg-[#09090B]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <Logo />
          <AgentStatus />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 sm:mb-10 text-center max-w-2xl px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-[50px] font-semibold tracking-[-0.035em] text-[#F4F4F5] leading-[1.12]">
            Book a restaurant table <br className="hidden sm:inline" />
            with an <span className="text-[#5EEAD4]">AI voice agent</span>.
          </h1>
          <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-lg mx-auto">
            Enter the customer&apos;s details and our AI booking agent will call them directly to handle the reservation.
          </p>
        </motion.div>

        {/* Interactive Form & Call Status Transitions */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {stage === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full flex justify-center"
              >
                <CustomerForm onSubmit={handleStartCall} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full flex justify-center"
              >
                <CallStatus
                  customerName={customerName}
                  phoneNumber={phoneNumber}
                  stage={stage as CallStage}
                  errorMessage={errorMessage}
                  onReset={handleReset}
                  onRetry={handleRetry}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#71717A] border-t border-[#27272A]/30">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} VaaniBook. All rights reserved.</span>
          <span className="text-[#5EEAD4]/70 font-mono text-[11px]">Sarvam Telephony Engine</span>
        </div>
      </footer>
    </div>
  );
}
