import { SubscribeButton, SubscribeButtonProps } from '../../components/SubscribeButton'
import formatPrice from '../../utils/formatPrice'
import styles from './styles.module.scss'

export type HomeTemplateProps = {
  product: {
    buttonProps: SubscribeButtonProps
    amount: number
  }
}

export function HomeTemplate({ product }: HomeTemplateProps) {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
      <span>👋 <em>Hey, welcome</em></span>
        <h1>News amount the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for {formatPrice(product.amount)} month</span>
        </p>
        <SubscribeButton {...product.buttonProps} />
      </section>
      <img src="/images/avatar.svg" alt="Man coding" />
    </main>
  )
}