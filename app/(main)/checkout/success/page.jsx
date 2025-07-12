'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {saveOrder } from '@/actions/order'
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"




export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const handleSave = async () => {
      if (!sessionId) return
      await saveOrder(sessionId)
    }

    handleSave()
  }, [sessionId])


  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="shadow-2xl rounded-2xl border-green-300">
          <CardContent className="p-6 text-center">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
            >
              <CheckCircle2 className="text-green-500 w-20 h-20" />
            </motion.div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Order Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
}
