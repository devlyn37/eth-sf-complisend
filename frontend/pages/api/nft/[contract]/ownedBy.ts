import { NextApiRequest, NextApiResponse } from 'next'
import { ZDK, ZDKChain, ZDKNetwork } from '@zoralabs/zdk'
import { endianness } from 'os'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address
  if (typeof address !== 'string') {
    return res.status(400).end()
  }

  const networkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Goerli,
  }

  const zdk = new ZDK({
    endpoint: 'https://api.zora.co/graphql',
    networks: [networkInfo],
  })
  const args = {
    where: {
      collectionAddresses: [req.query.contract as string],
      ownerAddresses: [address],
    },
    pagination: { limit: 1 },
    includeFullDetails: false,
    includeSalesHistory: false,
  }

  const response = await zdk.tokens(args)
  console.log(response)

  return res.status(200).json({
    ownedBy: response.tokens.nodes.length > 0,
  })
}
