import { NextApiRequest, NextApiResponse } from 'next'
import { ZDK } from '@zoralabs/zdk'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { contract, tokenId } = req.query
  const zdk = new ZDK({ endpoint: 'https://api.zora.co/graphql' })
  const tokenArgs = {
    token: {
      address: contract as string,
      tokenId: tokenId as string,
    },
    includeFullDetails: false, // Optional, provides more data on the NFT such as all historical events
  }

  const response = await zdk.token(tokenArgs)

  return res.status(200).json({
    owner: response.token?.token.owner,
    image: response.token?.token.image?.mediaEncoding?.original,
  })
}
