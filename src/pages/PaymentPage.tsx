import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { attraction, price } = location.state || { attraction: "Taj Mahal", price: 50 };
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card text-center">
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
              <CardDescription>Your ticket has been booked successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Ticket Details</h3>
                <p><strong>Attraction:</strong> {attraction}</p>
                <p><strong>Ticket ID:</strong> TKT-{Date.now()}</p>
                <p><strong>Amount:</strong> ₹{price}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-800">Your Travel Guide</h3>
                <p className="text-blue-700">Guide: Rajesh Kumar</p>
                <p className="text-blue-700">Contact: +91 98765 43210</p>
                <p className="text-blue-700">Experience: 5 years</p>
                <p className="text-sm text-blue-600 mt-2">Your guide will contact you 30 minutes before the visit</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-green-800">After Your Visit</h3>
                <p className="text-sm text-green-700">Once you complete your visit, you'll be able to:</p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Rate your travel guide</li>
                  <li>• Provide feedback about the experience</li>
                  <li>• Mark the trip as completed</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={() => navigate("/trip-itinerary")} 
                  variant="outline"
                  className="flex-1"
                >
                  View Itinerary
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/explore")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
          <h1 className="text-3xl font-bold gradient-text">Complete Payment</h1>
          <p className="text-muted-foreground">Book your ticket for {attraction}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>UPI</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll be redirected to your UPI app to complete the payment
                  </p>
                </div>
              )}

              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full btn-hero"
              >
                {isProcessing ? "Processing..." : `Pay ₹${price}`}
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Attraction Ticket</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{(price * 0.18).toFixed(0)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(price * 1.18).toFixed(0)}</span>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">What's Included</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Entry ticket to {attraction}</li>
                  <li>• Free professional travel guide</li>
                  <li>• Safety monitoring during visit</li>
                  <li>• Emergency support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
