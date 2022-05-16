import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'

async function buffer(stream: Readable) {
  const chunks: Buffer[] = []
  
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end("Method Not Allowed")
  }

  const buff = await buffer(req)
  const secret = req.headers['stripe-signature'] || 'não encontrou nada'
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  console.log(secret)
  console.log(webhookSecret)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buff, secret, webhookSecret)
  } catch (err: any) {
    console.error('morreu mamando')
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const { type } = event

  if(!relevantEvents.has(type)) {
    console.log(`Webhook received: ${type}`)
    return res.status(400).send(`Webhook Error: Unknown event type ${type}`)
  }

  console.log(`Received event: ${event}`)

  res.status(200).json({ ok: true })
}