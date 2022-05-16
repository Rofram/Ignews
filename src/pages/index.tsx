import { GetStaticProps } from 'next'
import Head from "next/head"
import { stripe } from '../services/stripe'
import { HomeTemplate, HomeTemplateProps } from "../templates/Home"

export default function HomePage (props: HomeTemplateProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <HomeTemplate {...props} />
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRODUCT_PRICE!, {
    expand: ['product']
  })

  const product = {
    id: price.id,
    amount: price.unit_amount
  }

  return {
    revalidate: 60 * 60 * 24, // 1 day
    props: {
      product
    }
  }
}
