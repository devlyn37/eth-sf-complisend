# Complisend

KYC erc20/721 transfer with messaging and reporting to an auditor

This project started at SF ETH Global hackathon 

## Features

- transfer only if the recipient has KYC_SBT (non-transferable NFT with zk proof of identity that we built at eth NYC)
- modified transfer function for ERC20 and ERC721
- with the transfer, send notes (like Venmo), Photos, zkp, and videos
- DAO voting with the transfer tokens
- reporting of over $3000 transaction (anti-money-laundry and money business law compliance)
- push notification
- oracle checks black-listed addresses and white-listed tokens [TODO]

## How we do it

- wrap tokens into voting erc1155 with a modified transfer function that checks for KYC-SBT
- send a message to the receiver using xmtp, ipfs, livepeer
- report the encrypted transaction as an xmtp message and as a mina state
- tellor and uma as oracles
![send screen not verified](https://github.com/devlyn37/eth-sf-complisend/raw/main/screenshots/Screen_Shot_2022-11-06_at_11.13.16_AM.png)

## Getting Started

we're using yarn

run

```bash
yarn
```

to install everything

# Building and running stuff

```bash
yarn compile
```

This will compile the contract and update the typechains and abi in frontend as well!

```bash
cd frontend
yarn
```

This will install the frontend packages

Then run 

```bash
yarn dev
```

This will start up the Next.js development server. Your site will be available at http://localhost:3000/
