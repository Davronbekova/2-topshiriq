# 2-topshiriq: PoW Blockchain + Mining + Wallet + Swap (localhost)

Ushbu loyihada quyidagilar bor:
- SHA-256 asosida PoW mining (`MineableToken.sol`)
- Doimiy reward (`immutable reward`) va target (`difficulty`) tushunchasi
- Wallet (MetaMask) orqali mining qilish
- Mined tokenni localhostda swap qilish (`LocalSwap.sol`)
- Qo'shimcha mini-chain demo (`pow-chain.js`)

## 1) O'rnatish

```bash
npm install
```

## 2) Local node ishga tushirish

1-terminal:
```bash
npm run node
```

## 3) Contractlarni deploy qilish

2-terminal:
```bash
npm run compile
npm run deploy
```

`npm run deploy` oxirida contract addresslar chiqadi.

## 4) Frontendga address qo'yish

`public/app.js` ichidagi quyilarni deploydan chiqqan manzillarga almashtiring:
- `PASTE_MINEABLE_TOKEN_ADDRESS`
- `PASTE_SWAP_TOKEN_ADDRESS`
- `PASTE_SWAP_ADDRESS`

## 5) Frontendni ochish

3-terminal:
```bash
npm run start
```

Brauzer: `http://localhost:3000`

## 6) Ishlatish

- `Connect Wallet` bosing (MetaMask localhost tarmog'ida bo'lsin)
- `Start Mining` bosing: frontend nonce qidiradi, keyin `mine()` chaqiradi
- `Swap` bo'limida MNT -> SWP almashadi (`1 MNT = 2 SWP`)

## Qo'shimcha: mini blockchain demo

```bash
npm run mine:demo
```

Bu `pow-chain.js` ichidagi oddiy blok qazish jarayonini ko'rsatadi.

## ABI fayllar
- abi/MineableToken.abi.json
- abi/SwapToken.abi.json
- abi/LocalSwap.abi.json

