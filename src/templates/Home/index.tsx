import { SubscribeButton, SubscribeButtonProps } from '../../components/SubscribeButton'
import styles from './styles.module.scss'

export type HomeTemplateProps = {
  product: {
    buttonProps: SubscribeButtonProps
    amount: string
  }
}

export function HomeTemplate({ product: { buttonProps, amount } }: HomeTemplateProps) {
  return (
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
      <span>👋 <em>Hey, welcome</em></span>
        <h1>News amount the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br />
          <span>for {amount} month</span>
        </p>
        <SubscribeButton {...buttonProps} />
      </section>
      <img src="/images/avatar.svg" alt="Man coding" />
    </main>
  )
}