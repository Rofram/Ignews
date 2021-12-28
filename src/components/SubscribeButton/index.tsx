import { useSession, signIn } from 'next-auth/react'
import { getStripeInstance } from '../../services/stripe-js'
import styles from './styles.module.scss'

export type SubscribeButtonProps = {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data, status } = useSession()

  async function handleSubscribe() {
    if(status != 'authenticated') {
      signIn('github')
      return
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
      })

      const { sessionId } = await response.json()

      const stripe = await getStripeInstance()

      await stripe?.redirectToCheckout({ sessionId })
    } catch(err) {
      alert(err)
    }
  }

  return (
    <button 
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}