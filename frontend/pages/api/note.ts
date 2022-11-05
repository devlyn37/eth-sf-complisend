import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Note Webhook Running!')

  console.log('body')
  console.log(req.body)

  console.log('query')
  console.log(req.query)

  return res.status(200).end()
}
