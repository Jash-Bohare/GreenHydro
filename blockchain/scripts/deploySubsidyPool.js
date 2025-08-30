const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("🚀 Starting SubsidyPool deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Get the token address (you'll need to replace this with your deployed token address)
    const tokenAddress = process.env.TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      console.log("⚠️  WARNING: No token address provided!");
      console.log("💡 Set TOKEN_ADDRESS in .env or deploy token first");
      console.log("💡 Or run: npm run deploy:local");
      process.exit(1);
    }
    
    console.log("🔗 Token address:", tokenAddress);
    
    console.log("🔨 Deploying SubsidyPool contract...");
    const SubsidyPool = await ethers.getContractFactory("SubsidyPool");
    const subsidyPool = await SubsidyPool.deploy(tokenAddress);
    
    console.log("⏳ Waiting for deployment confirmation...");
    await subsidyPool.waitForDeployment();
    
    const poolAddress = await subsidyPool.getAddress();
    console.log("✅ SubsidyPool deployed successfully!");
    console.log("📍 Contract address:", poolAddress);
    console.log("🔗 Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${poolAddress}`);
    
    // Add deployer as certifier
    console.log("🔐 Adding deployer as certifier...");
    await subsidyPool.addCertifier(deployer.address);
    console.log("✅ Deployer added as certifier");
    
    // Get token instance to fund the pool
    const token = await ethers.getContractAt("GreenSubsidyToken", tokenAddress);
    const deployerBalance = await token.balanceOf(deployer.address);
    
    console.log("💰 Deployer token balance:", ethers.formatUnits(deployerBalance, 18), "GST");
    
    if (deployerBalance > 0) {
      console.log("🏦 Funding subsidy pool...");
      const fundAmount = deployerBalance.div(2); // Fund half of deployer's balance
      
      // Approve pool to spend tokens
      await token.approve(poolAddress, fundAmount);
      console.log("✅ Token approval granted");
      
      // Fund the pool
      await subsidyPool.deposit(fundAmount);
      console.log("✅ Pool funded with", ethers.formatUnits(fundAmount, 18), "GST");
    }
    
    console.log("\n📊 Deployment Summary:");
    console.log("   Token:", tokenAddress);
    console.log("   Pool:", poolAddress);
    console.log("   Certifier:", deployer.address);
    console.log("   Pool Balance:", ethers.formatUnits(await token.balanceOf(poolAddress), 18), "GST");
    
    return { tokenAddress, poolAddress };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("🎉 SubsidyPool deployment completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
