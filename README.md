# Delivery Proof

A Quantum Pass entry built from QoreChain's official `create-qorechain-dapp@0.14.0` fullstack-web starter. The app fingerprints a file with SHA-256 in the browser. QoreX signs a Diana testnet self-transfer whose public memo records the fingerprint. A verification link contains only the transaction hash. Clients can check their copy without a wallet.

## Features

- Create a SHA-256 fingerprint for a file up to 50 MB. The file stays in your browser.
- Record the fingerprint in a public Diana testnet transaction memo using QoreX hybrid signing.
- Share a receipt link containing the transaction hash. A recipient can verify a file without a wallet and see the recorded timestamp or a mismatch.

## Verified Diana testnet receipt

The live test passed on 25 November 2026 at 00:17:08 UTC (01:17:08 WAT), in block 10,696,981. The transaction succeeded and includes a QoreChain hybrid signature. The original sample matched the on-chain fingerprint, and the edited copy returned a mismatch.

- Transaction hash: `6397B736EADDF89F790064A599207D9153561CB6B07AAB574C4833B6326A75FD`
- Diana testnet address: `qor17lct6mq43epegsktvmfgyn79yk8ad4a9q3wkhu`
- [On-chain transaction and memo](https://api-testnet.qore.host/cosmos/tx/v1beta1/txs/6397B736EADDF89F790064A599207D9153561CB6B07AAB574C4833B6326A75FD)

## Run locally

Install Git and Node.js 20 or later, then run:

```sh
git clone https://github.com/kblvck/delivery-proof.git
cd delivery-proof
npm ci
npm run dev
```

In Windows PowerShell, use `npm.cmd ci` and `npm.cmd run dev` if script execution blocks `npm`. Open the local URL Vite prints. Use a browser with the QoreX extension installed if you want to create receipts.

For a production build, run `npm run build`. Host behind HTTPS and forward same-origin `/lcd/*` requests to `https://api-testnet.qore.host/*` with the prefix stripped. Vite development and preview already supply this proxy.

If your development environment requires an outbound HTTPS proxy, set `QORE_HTTPS_PROXY` to your proxy URL before starting Vite.

## Record and verify a receipt

1. Open the app in a browser with QoreX. Select Diana and fund a fresh testnet address with test QOR from the [official event guide](https://build.qorechain.io/start).
2. Pick a sample file and select **Sign with QoreX**. Confirm Diana, your own address as the recipient, 1 uqor of test funds, and the displayed fee. Approve in QoreX.
3. Copy the resulting verification link. Open it or use **Verify file** and enter the transaction hash. The verifier needs access to a running instance of the app. A localhost link works on the computer running that instance.
4. Select the original file and click **Verify fingerprint**. The app compares the file’s local hash to the memo and shows the recorded block timestamp when available. Select a modified copy and verify against the same transaction to see a mismatch.

A matching receipt shows that the testnet recorded the fingerprint at a given time. Anyone with a suspected copy can test whether it matches the public fingerprint. The receipt cannot prove who created the file, who received it, or whether it was read.

## Hackathon entry

This project uses the Apache-2.0 license. The event asks for a public licensed repository, README, featured image, video of up to three minutes, and the testnet address used by the project. See the [official rules](https://build.qorechain.io/rules).
