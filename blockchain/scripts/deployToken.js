const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("🚀 Starting GreenSubsidyToken deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

    // Check if we have enough balance
    const balance = await deployer.provider.getBalance(deployer.address);
    if (balance < ethers.parseEther("0.01")) {
      throw new Error("❌ Insufficient balance for deployment. Need at least 0.01 ETH");
    }

    const initialSupply = ethers.parseUnits("1000000", 18); // 1M GST
    console.log("🏭 Initial supply:", ethers.formatUnits(initialSupply, 18), "GST");

    console.log("🔨 Deploying GreenSubsidyToken contract...");
    const Token = await ethers.getContractFactory("GreenSubsidyToken");
    
    // Add explicit gas settings and timeout
    const deploymentTx = await Token.deploy(initialSupply, {
      gasLimit: 3000000, // Explicit gas limit
      maxFeePerGas: ethers.parseUnits("20", "gwei"), // Max fee
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"), // Priority fee
    });
    
    console.log("⏳ Transaction hash:", deploymentTx.deploymentTransaction().hash);
    console.log("⏳ Waiting for deployment confirmation...");
    
    // Add timeout protection
    const deploymentPromise = deploymentTx.waitForDeployment();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Deployment timeout after 3 minutes")), 180000)
    );
    
    const token = await Promise.race([deploymentPromise, timeoutPromise]);
    
    const tokenAddress = await token.getAddress();
    console.log("✅ GreenSubsidyToken deployed successfully!");
    console.log("📍 Contract address:", tokenAddress);
    console.log("🔗 Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${tokenAddress}`);
    
    // Verify deployment
    const deployedToken = await ethers.getContractAt("GreenSubsidyToken", tokenAddress);
    const totalSupply = await deployedToken.totalSupply();
    const name = await deployedToken.name();
    const symbol = await deployedToken.symbol();
    
    console.log("📊 Token details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Total Supply:", ethers.formatUnits(totalSupply, 18), "GST");
    
    return tokenAddress;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    if (error.message.includes("timeout")) {
      console.log("💡 Try increasing gas limit or check network connectivity");
    }
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Add more ETH to your deployment account");
    }
    if (error.message.includes("network")) {
      console.log("💡 Check your RPC URL and network connectivity");
    }
    process.exit(1);
  }
}

// Add proper exit handling
main()
  .then(() => {
    console.log("🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
