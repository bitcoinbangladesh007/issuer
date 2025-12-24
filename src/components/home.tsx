import React, { useState } from "react";
import { motion } from "framer-motion";
import ImageUploader from "./ImageUploader";
import TransactionForm from "./TransactionForm";
import TransactionResult from "./TransactionResult";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Buffer } from "buffer";

interface HashData {
  hash: string;
  isCalculated: boolean;
}

interface TransactionData {
  txId: string;
  isSuccess: boolean;
  error?: string;
}

const Home = () => {
  const [hashData, setHashData] = useState<HashData>({
    hash: "",
    isCalculated: false,
  });
  const [customText, setCustomText] = useState<string>("");
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleHashCalculated = (hash: string) => {
    setHashData({ hash, isCalculated: true });
  };

  const [derivedAddress, setDerivedAddress] = useState<string>("");

  const handleFormSubmit = async (
    text: string,
    mnemonic: string,
    address?: string,
  ) => {
    setCustomText(text);
    setDerivedAddress(address || "");
    setIsProcessing(true);

    try {
      // Import algosdk dynamically
      const algosdk = await import("algosdk");

      // Create algod client for Algorand testnet
      const algodToken = "";
      const algodServer = "https://testnet-api.algonode.cloud";
      const algodPort = 443;
      const algodClient = new algosdk.Algodv2(
        algodToken,
        algodServer,
        algodPort,
      );

      // Get account from mnemonic
      const account = algosdk.mnemonicToSecretKey(mnemonic.trim());

      // Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do();

      // Create note with custom text and image hash
      const noteText = `${text}${hashData.hash ? ` | ${hashData.hash}` : ""}`;
      const note = new Uint8Array(Buffer.from(noteText, "utf8"));

      // Create payment transaction (sending 0 ALGO to self with note)
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: account.addr,
        amount: 0,
        note: note,
        suggestedParams: suggestedParams,
      });

      // Sign the transaction
      const signedTxn = txn.signTxn(account.sk);

      // Submit the transaction
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setTransactionData({
        txId: txId,
        isSuccess: true,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionData({
        txId: "",
        isSuccess: false,
        error:
          error instanceof Error
            ? error.message
            : "Transaction failed. Please check your mnemonic and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setHashData({ hash: "", isCalculated: false });
    setCustomText("");
    setDerivedAddress("");
    setTransactionData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Professional Header */}
      <div className="relative shadow-lg overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-[#FF9933] to-[#138808]"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            backgroundSize: ["200% 100%", "250% 100%", "200% 100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "linear-gradient(90deg, #FF9933 0%, #FF9933 35%, #138808 65%, #138808 100%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Arunachal Police Logo - Left */}
            <div className="flex-shrink-0">
              <img 
                src="/arunachal_police_logo.png" 
                alt="Arunachal Police Logo" 
                className="h-32 w-32 object-contain"
              />
            </div>
            
            {/* Center Content */}
            <div className="text-center flex-1 px-4">
              <div className="text-center mb-4">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Temper Proof Evidence Collection
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  Testnet Ready
                </Badge>
              </div>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Securely upload images, calculate SHA-256 hashes, and digitally
                signed hashes in a temper proof storage using blockchain features
              </p>
            </div>
            
            {/* Hills Society Logo - Right */}
            <div className="flex-shrink-0 text-center">
              <p className="text-white/80 text-xs font-medium mb-1">DEMO PRESENTED BY</p>
              <img 
                src="/hills_society_logo.png" 
                alt="Hills Society Logo" 
                className="h-24 w-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {!transactionData ? (
            <>
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      true
                        ? "bg-[#FF9933] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Upload Image
                  </span>
                  <Separator className="w-8" />
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      hashData.isCalculated
                        ? "bg-[#FF9933] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Calculate Hash
                  </span>
                  <Separator className="w-8" />
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      false
                        ? "bg-[#138808] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Submit Hash
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ImageUploader onHashCalculated={handleHashCalculated} />

                  {hashData.isCalculated && (
                    <Card className="p-6 border-2 border-[#138808]/20 bg-gradient-to-r from-[#138808]/5 to-transparent">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#138808]">
                          Generated Hash
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-[#138808] text-[#138808]"
                        >
                          SHA-256
                        </Badge>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="font-mono text-sm break-all text-gray-700">
                          {hashData.hash}
                        </p>
                      </div>
                    </Card>
                  )}
                </div>

                <div>
                  <TransactionForm
                    imageHash={hashData.hash}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isProcessing}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <TransactionResult
                transactionId={transactionData.txId}
                error={transactionData.error}
                address={derivedAddress}
                onNewTransaction={handleReset}
              />
            </div>
          )}
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-r from-[#138808] to-[#0d6b06] mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-white/90 text-sm">
              This application is for demonstration purposes only . Made for arunachal Police by Hills Society
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
