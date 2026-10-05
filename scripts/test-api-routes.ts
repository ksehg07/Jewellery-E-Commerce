import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

import { POST as createOrderHandler } from "../src/app/api/create-order/route";
import { POST as verifyPaymentHandler } from "../src/app/api/verify-payment/route";
import { NextRequest } from "next/server";

function createMockRequest(body: any, url: string = "http://localhost:3000"): NextRequest {
  return new NextRequest(new URL(url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function runRouteTests() {
  console.log("=== TESTING API ROUTE HANDLERS ===");

  // 1. Create order: Invalid amount (< 100 paise)
  console.log("\n[Test 1] POST /api/create-order with amount < 100 paise");
  const reqSmallAmount = createMockRequest({ amount: 50 });
  const resSmallAmount = await createOrderHandler(reqSmallAmount);
  const dataSmallAmount = await resSmallAmount.json();
  console.log("Status:", resSmallAmount.status, "Body:", dataSmallAmount);
  if (resSmallAmount.status !== 400) throw new Error("Expected status 400 for amount < 100");
  console.log("✓ Test 1 Passed: Rejected amount < 100 with status 400");

  // 2. Create order: Missing amount
  console.log("\n[Test 2] POST /api/create-order with missing amount");
  const reqNoAmount = createMockRequest({ currency: "INR" });
  const resNoAmount = await createOrderHandler(reqNoAmount);
  const dataNoAmount = await resNoAmount.json();
  console.log("Status:", resNoAmount.status, "Body:", dataNoAmount);
  if (resNoAmount.status !== 400) throw new Error("Expected status 400 for missing amount");
  console.log("✓ Test 2 Passed: Rejected missing amount with status 400");

  // 3. Create order: Valid amount (1000 paise = 10.00 INR)
  console.log("\n[Test 3] POST /api/create-order with valid amount (1000 paise)");
  const reqValid = createMockRequest({ amount: 1000, currency: "INR", receipt: "rcpt_test_api" });
  const resValid = await createOrderHandler(reqValid);
  const dataValid = await resValid.json();
  console.log("Status:", resValid.status, "Body:", dataValid);
  if (resValid.status !== 200 || !dataValid.order_id || dataValid.amount !== 1000 || dataValid.currency !== "INR") {
    throw new Error("Expected status 200 with order_id, amount, and currency");
  }
  console.log("✓ Test 3 Passed: Successfully created order with order_id:", dataValid.order_id);

  const testOrderId = dataValid.order_id;
  const testPaymentId = "pay_mock_" + Date.now();

  // 4. Verify payment: Missing fields
  console.log("\n[Test 4] POST /api/verify-payment with missing fields");
  const reqMissingFields = createMockRequest({ razorpay_order_id: testOrderId });
  const resMissingFields = await verifyPaymentHandler(reqMissingFields);
  const dataMissingFields = await resMissingFields.json();
  console.log("Status:", resMissingFields.status, "Body:", dataMissingFields);
  if (resMissingFields.status !== 400 || dataMissingFields.success !== false) {
    throw new Error("Expected status 400 for missing fields");
  }
  console.log("✓ Test 4 Passed: Rejected missing fields with status 400");

  // 5. Verify payment: Signature mismatch
  console.log("\n[Test 5] POST /api/verify-payment with invalid/tampered signature");
  const reqTampered = createMockRequest({
    razorpay_order_id: testOrderId,
    razorpay_payment_id: testPaymentId,
    razorpay_signature: "bad_signature_1234567890abcdef1234567890abcdef1234567890abcdef12345678",
  });
  const resTampered = await verifyPaymentHandler(reqTampered);
  const dataTampered = await resTampered.json();
  console.log("Status:", resTampered.status, "Body:", dataTampered);
  if (resTampered.status !== 400 || dataTampered.success !== false) {
    throw new Error("Expected status 400 for signature mismatch");
  }
  console.log("✓ Test 5 Passed: Rejected signature mismatch with status 400");

  // 6. Verify payment: Valid HMAC-SHA256 signature
  console.log("\n[Test 6] POST /api/verify-payment with valid HMAC-SHA256 signature");
  const validSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex");

  const reqSuccess = createMockRequest({
    razorpay_order_id: testOrderId,
    razorpay_payment_id: testPaymentId,
    razorpay_signature: validSignature,
  });
  const resSuccess = await verifyPaymentHandler(reqSuccess);
  const dataSuccess = await resSuccess.json();
  console.log("Status:", resSuccess.status, "Body:", dataSuccess);
  if (resSuccess.status !== 200 || dataSuccess.success !== true) {
    throw new Error("Expected status 200 with success: true");
  }
  console.log("✓ Test 6 Passed: Successfully verified valid HMAC-SHA256 payment signature!");

  console.log("\n=========================================");
  console.log("ALL API ROUTE HANDLER TESTS PASSED! 100%");
  console.log("=========================================");
}

runRouteTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

