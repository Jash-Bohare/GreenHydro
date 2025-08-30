import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

function Introduction() {
  const [formData, setFormData] = useState({
    fullName: "",
    walletAddress: "",
    plantCapacity: "",
    userType: "producer"
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate = useNavigate();

  // Check if wallet was already connected
  useEffect(() => {
    const connected = localStorage.getItem("walletConnected");
    if (connected) {
      setIsWalletConnected(true);
      setFormData((prev) => ({
        ...prev,
        walletAddress: localStorage.getItem("walletAddress") || ""
      }));
    }
  }, []);

  // Connect wallet using ethers
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAddress = accounts[0];

      setFormData((prev) => ({ ...prev, walletAddress: selectedAddress }));
      setIsWalletConnected(true);

      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", selectedAddress);

      alert("Wallet connected successfully!");
    } catch (error) {
      alert("Failed to connect wallet: " + error.message);
    }
  };

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Always required
    if (!formData.fullName || !formData.walletAddress) {
      alert("Please fill in all fields");
      return;
    }

    // Producers must also provide plantCapacity
    if (formData.userType === "producer" && !formData.plantCapacity) {
      alert("Please enter plant capacity");
      return;
    }

    try {
      if (formData.userType === "producer") {
        // Call backend API for producer
        const res = await axios.post("http://localhost:5000/api/producers", {
          name: formData.fullName,
          wallet: formData.walletAddress,
          plantCapacity: Number(formData.plantCapacity)
        });
        alert(`Producer Registered! ID: ${res.data.id}`);
      } else {
        // Placeholder for admin API call
        await axios.post("http://localhost:5000/api/admins", {
          name: formData.fullName,
          wallet: formData.walletAddress
        });
        alert("Admin registered!");
      }

      // Save form data locally
      localStorage.setItem("registrationData", JSON.stringify(formData));
      localStorage.setItem("userType", formData.userType);
      localStorage.setItem("registrationComplete", "true");

      // Navigate
      if (formData.userType === "admin") {
        navigate("/certifier");
      } else {
        navigate("/final");
      }
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="intro-card">
          <h1 className="page-title">Green Hydrogen Subsidy DApp</h1>
          <p className="page-subtitle">
            Register your plant to access automated subsidy disbursement
          </p>

          <form onSubmit={handleRegister} className="registration-form">
            {/* User Type */}
            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="producer">Producer</option>
                <option value="admin">Admin/Certifier</option>
              </select>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Wallet Address + Connect */}
            <div className="form-group">
              <label htmlFor="walletAddress">Wallet Address</label>
              <div className="wallet-input-group">
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  placeholder="Connect wallet to auto-populate"
                  required
                />
                <button
                  type="button"
                  onClick={connectWallet}
                  className={`wallet-btn ${isWalletConnected ? "connected" : ""}`}
                >
                  {isWalletConnected ? "Connected" : "Connect Wallet"}
                </button>
              </div>
            </div>

            {/* Plant Capacity only for producers */}
            {formData.userType === "producer" && (
              <div className="form-group">
                <label htmlFor="plantCapacity">Plant Capacity (MW)</label>
                <input
                  type="number"
                  id="plantCapacity"
                  name="plantCapacity"
                  value={formData.plantCapacity}
                  onChange={handleInputChange}
                  placeholder="Enter capacity in megawatts"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            )}

            <button type="submit" className="register-btn">
              {formData.userType === "admin"
                ? "Register as Admin"
                : "Register Plant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Introduction;
