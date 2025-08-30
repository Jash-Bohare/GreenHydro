# 🚀 GreenHydro Token Deployment Guide

## Quick Setup (5 minutes)

### 1. Environment Setup
Create a `.env` file in the blockchain folder:

```bash
# Sepolia Testnet Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# OR use Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Deployer Private Key (without 0x prefix)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Optional: Etherscan API Key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 2. Get Sepolia ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Or use [Alchemy Faucet](https://sepoliafaucet.com/)
- You need at least 0.1 ETH for deployment

### 3. Deploy Token
```bash
cd blockchain
npm install
npx hardhat run scripts/deployToken.js --network sepolia
```

## 🔧 Troubleshooting

### If deployment gets stuck:
1. **Check balance**: Ensure you have >0.01 ETH
2. **Check RPC**: Verify your Sepolia RPC URL is working
3. **Gas issues**: The script now auto-calculates gas
4. **Timeout**: Script has 2-minute timeout protection

### Common Errors:
- `insufficient funds`: Add more Sepolia ETH
- `timeout`: Check network connectivity
- `invalid private key`: Ensure no 0x prefix

## 📊 Expected Output
```
🚀 Starting GreenSubsidyToken deployment...
📝 Deploying with account: 0x...
💰 Account balance: 0.5 ETH
🏭 Initial supply: 1000000 GST
🔨 Deploying GreenSubsidyToken contract...
⏳ Waiting for deployment confirmation...
✅ GreenSubsidyToken deployed successfully!
📍 Contract address: 0x...
🔗 Sepolia Etherscan: https://sepolia.etherscan.io/address/0x...
📊 Token details:
   Name: GreenSubsidyToken
   Symbol: GST
   Total Supply: 1000000 GST
🎉 Deployment completed successfully!
```

## 🆘 Emergency Fixes

### If still stuck:
1. **Kill process**: Ctrl+C
2. **Clear cache**: `npx hardhat clean`
3. **Restart**: Run deployment again
4. **Check logs**: Look for specific error messages

### Network Issues:
- Try different RPC providers (Infura, Alchemy, QuickNode)
- Check if Sepolia is congested
- Use local hardhat node for testing: `npx hardhat node`
