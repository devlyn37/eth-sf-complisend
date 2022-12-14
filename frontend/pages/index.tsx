import type { NextPage } from 'next'
import { Layout } from '../components/layout/Layout'
import { Sendform } from '../components/SendingForm'
import { WithdrawForm } from '../components/WithdrawForm'
import { Head } from '../components/layout/Head'

const Home: NextPage = () => {
  return (
    <Layout>
      <Head />
      <div className="flex flex-col">
        <WithdrawForm />
        <Sendform />
        <div className="p-4"></div>
      </div>
    </Layout>
  )
}

export default Home
