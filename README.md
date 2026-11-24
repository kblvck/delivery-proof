# Delivery Proof

A Quantum Pass entry built from QoreChain's official `create-qorechain-dapp@0.14.0` fullstack-web starter. The app fingerprints a file with SHA-256 in the browser. QoreX signs a Diana testnet self-transfer whose public memo records the fingerprint. A verification link contains only the transaction hash. Clients can check their copy without a wallet.

## Run locally

Install Node.js 20 or later, then run `npm ci` and `npm run dev`. Open the localhost URL Vite prints. For a production build, run `npm run build`. Host behind HTTPS and forward same-origin `/lcd/*` requests to `https://api-testnet.qore.host/*` with the prefix stripped. Vite development and preview already supply this proxy.

## Record and verify a receipt

1. Open the app in a browser with QoreX. Select Diana and fund a fresh testnet address with test QOR from the [official event guide](https://build.qorechain.io/start).
2. Pick a sample file and select **Sign with QoreX**. Confirm Diana, your own address as the recipient, 1 uqor of test funds, and the displayed fee. Approve in QoreX.
3. Open the resulting verification link and select the same file. The app checks the successful transaction's memo and displays the block timestamp if available. Change the file and verify again to see a mismatch.

A matching receipt shows that the testnet recorded the fingerprint at a given time. Anyone with a suspected copy can test whether it matches the public fingerprint. The receipt cannot prove who created the file, who received it, or whether it was read.

## Hackathon entry

Save the committed hybrid-signed transaction hash and testnet address for the submission. The event also asks for a public licensed repository, README, featured image, and video of up to three minutes. See the [official rules](https://build.qorechain.io/rules).
