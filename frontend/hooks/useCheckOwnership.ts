import axios from 'axios'
import { useEffect, useState } from 'react'

export function useCheckOwnership(address: string | undefined) {
  const [ownsNFT, setOwnsNFT] = useState(false)

  useEffect(() => {
    const fetchOwnership = async () => {
      if (!address) {
        setOwnsNFT(false)
        return
      }

      try {
        const url = `/api/nft/0x246770348D8fEA72E45c0BbFFdda4A8170a73aC1/ownedBy?address=${address}`
        const result = await axios.get(url)
        setOwnsNFT(result.data.ownedBy as boolean)
      } catch (e) {
        console.log(e)
      }
    }

    fetchOwnership()
  }, [address])

  return ownsNFT
}
