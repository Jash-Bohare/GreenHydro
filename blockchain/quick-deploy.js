const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("🚀 QUICK DEPLOYMENT - GreenHydro Token");
    console.log("⏰ Hackathon Emergency Mode Activated!");
    
    // Use local hardhat network for immediate testing
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    const initialSupply = ethers.parseUnits("1000000", 18); // 1M GST
    console.log("🏭 Initial supply:", ethers.formatUnits(initialSupply, 18), "GST");

    console.log("🔨 Deploying GreenSubsidyToken contract...");
    const Token = await ethers.getContractFactory("GreenSubsidyToken");
    const token = await Token.deploy(initialSupply);
    
    console.log("⏳ Waiting for deployment...");
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log("✅ SUCCESS! Token deployed at:", tokenAddress);
    
    // Quick verification
    const totalSupply = await token.totalSupply();
    console.log("💰 Total Supply:", ethers.formatUnits(totalSupply, 18), "GST");
    
    console.log("\n🎯 NEXT STEPS:");
    console.log("1. Copy this address:", tokenAddress);
    console.log("2. Use it in your SubsidyPool deployment");
    console.log("3. Test with: npx hardhat console");
    
    return tokenAddress;
    
  } catch (error) {
    console.error("❌ Quick deployment failed:", error.message);
    console.log("💡 Try: npx hardhat clean && npx hardhat compile");
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("🎉 Quick deployment completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
