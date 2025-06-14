import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, Copy, Check, Shield, Key } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import algosdk from "algosdk";

interface TransactionFormProps {
  imageHash?: string;
  onSubmit: (text: string, mnemonic: string, address?: string) => void;
  isSubmitting?: boolean;
}

const TransactionForm = ({
  imageHash = "",
  onSubmit,
  isSubmitting = false,
}: TransactionFormProps) => {
  const [customText, setCustomText] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [derivedAddress, setDerivedAddress] = useState<string>("");
  const [addressCopied, setAddressCopied] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; mnemonic?: string }>(
    {},
  );

  const deriveAddressFromMnemonic = (mnemonicPhrase: string) => {
    try {
      const account = algosdk.mnemonicToSecretKey(mnemonicPhrase.trim());
      return account.addr;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (mnemonic.trim() && mnemonic.trim().split(" ").length === 25) {
      const address = deriveAddressFromMnemonic(mnemonic);
      if (address) {
        setDerivedAddress(address);
      } else {
        setDerivedAddress("");
      }
    } else {
      setDerivedAddress("");
    }
  }, [mnemonic]);

  const validateForm = () => {
    const newErrors: { text?: string; mnemonic?: string } = {};

    if (!customText.trim()) {
      newErrors.text = "Please enter some text";
    }

    if (!mnemonic.trim()) {
      newErrors.mnemonic = "Please enter your mnemonic phrase";
    } else if (mnemonic.trim().split(" ").length !== 25) {
      newErrors.mnemonic = "Mnemonic should contain 25 words";
    } else if (!derivedAddress) {
      newErrors.mnemonic = "Invalid mnemonic phrase";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(customText, mnemonic, derivedAddress);
    }
  };

  const copyAddress = async () => {
    if (derivedAddress) {
      await navigator.clipboard.writeText(derivedAddress);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-[#FF9933] to-[#FF9933]/90 text-white">
        <CardTitle className="text-xl font-bold flex items-center">
          <div className="p-2 bg-white/20 rounded-lg mr-3">
            <AlertCircle className="h-5 w-5" />
          </div>
          Transaction Details
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {imageHash && (
              <div className="p-4 bg-gradient-to-r from-[#138808]/5 to-transparent rounded-lg border-2 border-[#138808]/20">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-[#138808]">
                    Image Hash (SHA-256)
                  </Label>
                  <Badge
                    variant="outline"
                    className="border-[#138808] text-[#138808] text-xs"
                  >
                    Verified
                  </Badge>
                </div>
                <div className="p-3 bg-white rounded-md border border-gray-200 text-sm font-mono break-all text-gray-700">
                  {imageHash}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label
                htmlFor="customText"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <div className="p-1 bg-[#FF9933]/20 rounded mr-2">
                  <Key className="h-3 w-3 text-[#FF9933]" />
                </div>
                Acknowledgement Number
              </Label>
              <Input
                id="customText"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your acknowledgement number or identifier"
                className={`transition-all duration-200 ${errors.text ? "border-red-500 focus:border-red-500" : "focus:border-[#FF9933] focus:ring-[#FF9933]/20"}`}
              />
              {errors.text && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.text}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="mnemonic"
                className="text-sm font-semibold text-gray-700 flex items-center"
              >
                <div className="p-1 bg-[#138808]/20 rounded mr-2">
                  <Shield className="h-3 w-3 text-[#138808]" />
                </div>
                Mnemonic Phrase(Private Key)
              </Label>
              <Textarea
                id="mnemonic"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter your 25-word mnemonic phrase separated by spaces"
                className={`min-h-[120px] transition-all duration-200 ${errors.mnemonic ? "border-red-500 focus:border-red-500" : "focus:border-[#138808] focus:ring-[#138808]/20"}`}
              />
              {errors.mnemonic && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.mnemonic}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Format: word1 word2 word3 ... word25
                </p>
                <Badge variant="secondary" className="text-xs">
                  25 words required
                </Badge>
              </div>
            </div>

            {derivedAddress && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#138808]">
                  Derived Address
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gradient-to-r from-[#FF9933]/10 via-white to-[#138808]/10 border-2 border-[#138808] rounded-md">
                    <p className="font-mono text-sm break-all text-[#138808] font-semibold">
                      {derivedAddress}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyAddress}
                    className="border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white"
                  >
                    {addressCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {addressCopied && (
                  <p className="text-xs text-[#138808] font-medium">
                    Address copied to clipboard!
                  </p>
                )}
              </div>
            )}

            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 border-2"
            >
              <Shield className="h-4 w-4" />
              <AlertDescription className="font-medium">
                <strong>Security Notice:</strong> Never share your mnemonic
                phrase with anyone. This application is for demonstration
                purposes on Algorand Testnet only.
              </AlertDescription>
            </Alert>
          </div>
        </form>
      </CardContent>

      <CardFooter className="px-6 pt-6">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-[#138808] to-[#0d6b06] hover:from-[#0d6b06] hover:to-[#0a5505] text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Transaction...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Submit to Blockchain
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransactionForm;
