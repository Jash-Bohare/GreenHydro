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

  useEffect(() => {
    const connected = localStorage.getItem("walletConnected");
    const walletAddress = localStorage.getItem("walletAddress");
    
    if (connected && walletAddress) {
      setIsWalletConnected(true);
      setFormData((prev) => ({
        ...prev,
        walletAddress: walletAddress
      }));
    } else {
      // Clear any stale data
      localStorage.removeItem("walletConnected");
      localStorage.removeItem("walletAddress");
      setIsWalletConnected(false);
      setFormData((prev) => ({
        ...prev,
        walletAddress: ""
      }));
    }
  }, []);

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

  const disconnectWallet = () => {
    setFormData((prev) => ({ ...prev, walletAddress: "" }));
    setIsWalletConnected(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      walletAddress: "",
      plantCapacity: "",
      userType: "producer"
    });
    setIsWalletConnected(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.fullName) {
      alert("Please enter your full name");
      return;
    }

    if (!isWalletConnected || !formData.walletAddress) {
      alert("Please connect your wallet first");
      return;
    }

    if (formData.userType === "producer" && !formData.plantCapacity) {
      alert("Please enter plant capacity");
      return;
    }

    try {
              if (formData.userType === "producer") {
          const res = await axios.post("http://localhost:5000/api/producers", {
            name: formData.fullName,
            wallet: formData.walletAddress,
            plantCapacity: Number(formData.plantCapacity)
          });
          alert(`Producer Registered Successfully! ID: ${res.data.id}`);
          
          // Save producer data to localStorage for document upload
          const producerData = {
            fullName: formData.fullName,
            walletAddress: formData.walletAddress,
            plantCapacity: formData.plantCapacity,
            producerId: res.data.id
          };
          localStorage.setItem('producerData', JSON.stringify(producerData));
          
          // Reset form after successful registration
          resetForm();
          
          // Navigate to upload page for producers
          navigate("/upload");
        } else {
        // For now, just show success message for certifier registration
        // TODO: Implement certifier registration API endpoint
        alert("Certifier registration feature coming soon!");
        return;
      }
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
    <div className="intro-page">
      <div className="intro-card">
        <h1 className="intro-title">Producer Registration</h1>
        <p className="intro-subtitle">
          Connect your wallet and register your hydrogen production facility
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
              <option value="producer">Hydrogen Producer</option>
              <option value="admin">Certifier/Admin</option>
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
                onClick={isWalletConnected ? disconnectWallet : connectWallet}
                className={`wallet-btn ${isWalletConnected ? "connected" : ""}`}
              >
                {isWalletConnected ? "Disconnect" : "Connect Wallet"}
              </button>
            </div>
          </div>

          {/* Plant Capacity */}
          {formData.userType === "producer" && (
            <div className="form-group">
              <label htmlFor="plantCapacity">Plant Capacity (kg/day)</label>
              <input
                type="number"
                id="plantCapacity"
                name="plantCapacity"
                value={formData.plantCapacity}
                onChange={handleInputChange}
                placeholder="Enter daily hydrogen production capacity"
                min="0"
                step="0.01"
                required
              />
            </div>
          )}

          <button type="submit" className="register-btn">
            {formData.userType === "admin"
              ? "Register as Certifier"
              : "Register Producer"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .intro-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to bottom right, #e0f2fe, #f0f9ff);
          font-family: "Inter", sans-serif;
          padding: 20px;
        }

        .intro-card {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          width: 100%;
          max-width: 540px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .intro-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
        }

        .intro-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          color: #1e40af;
          margin-bottom: 10px;
        }

        .intro-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 15px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
        }

        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          outline-color: #2563eb;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus,
        select:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .wallet-input-group {
          display: flex;
          gap: 10px;
        }

        .wallet-btn {
          background: #2563eb;
          border: none;
          padding: 10px 14px;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.3s ease;
        }

        .wallet-btn:hover {
          background: #1e40af;
        }

        .wallet-btn.connected {
          background: #16a34a;
        }

        .register-btn {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 12px;
          transition: background 0.3s ease;
        }

        .register-btn:hover {
          background: #1e40af;
        }


      `}</style>
    </div>
  );
}

export default Introduction;
