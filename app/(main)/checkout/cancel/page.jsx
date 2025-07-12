// app/declined/page.tsx or components/PaymentDeclined.tsx

"use client"

import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

export async function generateMetadata() {
  return {
    title: `Cancel | AIvana`,
    description: `Product failed to order`,
  };
}

export default function PaymentDeclined() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="shadow-2xl rounded-2xl border-red-300">
          <CardContent className="p-6 text-center">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
            >
              <XCircle className="text-red-500 w-20 h-20" />
            </motion.div>

            <h1 className="text-3xl font-bold text-red-700 mb-2">
              Order Failed
            </h1>
            <p className="text-gray-600 mb-4">
              We couldn't process your Order. Please try again or use a different method.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
                <Link href="/checkout">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
