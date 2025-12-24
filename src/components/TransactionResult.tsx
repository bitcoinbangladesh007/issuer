import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Check,
  Download,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Copy,
} from "lucide-react";

interface TransactionResultProps {
  transactionId?: string;
  error?: string;
  address?: string;
  onNewTransaction?: () => void;
}

const TransactionResult = ({
  transactionId = "",
  error = "",
  address = "",
  onNewTransaction = () => {},
}: TransactionResultProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = () => {
    setIsDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
    // In a real implementation, this would trigger the QR code download
  };

  const generateQRCodeUrl = (txId: string) => {
    // Generate a QR code using an external service - directly with transaction ID
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(txId)}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border-2 border-[#138808]/20">
      <CardHeader className="bg-gradient-to-r from-[#FF9933] via-[#FF9933] to-[#138808] text-white">
        <div className="flex items-center justify-between">
          {/* Arunachal Police Logo - Left */}
          <div className="flex-shrink-0">
            <img 
              src="/arunachal_police_logo.png" 
              alt="Arunachal Police Logo" 
              className="h-28 w-28 object-contain"
            />
          </div>
          
          {/* Center Content */}
          <div className="text-center flex-1 px-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              Transaction Complete
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Your hash has been successfully stored on Blockchain for life time!
            </CardDescription>
          </div>
          
          {/* Hills Society Logo - Right */}
          <div className="flex-shrink-0 text-center">
            <p className="text-white/80 text-xs font-medium mb-1">DEMO PRESENTED BY</p>
            <img 
              src="/hills_society_logo.png" 
              alt="Hills Society Logo" 
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-8 pb-6">
        {error ? (
          <Alert variant="destructive" className="mb-6 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Transaction Failed
            </AlertTitle>
            <AlertDescription className="text-base mt-2">
              {error}
            </AlertDescription>
          </Alert>
        ) : transactionId ? (
          <div className="space-y-8">
            {address && (
              <div className="p-6 rounded-xl border-2 border-[#138808]/30 bg-gradient-to-r from-[#FF9933]/5 via-white to-[#138808]/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#138808] flex items-center">
                    <div className="p-2 bg-[#138808]/20 rounded-lg mr-3">
                      <CheckCircle2 className="h-4 w-4 text-[#138808]" />
                    </div>
                    Arunachal Police Station 5 Address
                  </h3>
                  <Badge className="bg-[#138808] text-white">Verified</Badge>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                  <p className="font-mono text-sm break-all text-[#138808] font-semibold flex-1">
                    {address}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-[#138808] hover:bg-[#138808]/10"
                    onClick={() => navigator.clipboard.writeText(address)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                  <div className="p-2 bg-blue-200 rounded-lg mr-3">
                    <ExternalLink className="h-4 w-4 text-blue-800" />
                  </div>
                  Transaction ID
                </h3>
                <Badge
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  Confirmed
                </Badge>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                <p className="font-mono text-sm break-all text-gray-700 flex-1">
                  {transactionId}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-blue-600 hover:bg-blue-100"
                  onClick={() => navigator.clipboard.writeText(transactionId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">
                Verification QR Code
              </h3>
              {transactionId && (
                <div className="inline-block p-4 bg-white rounded-xl border-4 border-[#138808]/30 shadow-lg">
                  <img
                    src={generateQRCodeUrl(transactionId)}
                    alt="Transaction QR Code"
                    className="w-56 h-56 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Scan to view transaction details
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              No transaction has been submitted yet.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gradient-to-r from-[#138808] to-[#0d6b06] text-white p-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {transactionId && (
            <Button
              variant="outline"
              className="bg-white text-[#138808] hover:bg-gray-100 border-2 font-semibold flex-1"
              onClick={handleDownloadQR}
              disabled={isDownloading}
              size="lg"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Downloading QR Code...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onNewTransaction}
            className="bg-white text-[#138808] hover:bg-gray-100 border-2 font-semibold flex-1"
            variant="outline"
            size="lg"
          >
            {transactionId ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Create New Transaction
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Start New Transaction
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionResult;
