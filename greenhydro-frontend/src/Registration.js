import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

function Registration() {
    const [name, setName] = useState("");
    const [wallet, setWallet] = useState("");
    const [plantCapacity, setPlantCapacity] = useState("");

    // Connect MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWallet(accounts[0]);
        } else {
            alert("Please install MetaMask!");
        }
    };

    // Register producer
    const registerProducer = async () => {
        if (!name || !wallet || !plantCapacity) {
            alert("Fill all fields!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/producers", {
                name,
                wallet,
                plantCapacity: Number(plantCapacity)
            });
            alert(`Registered! ID: ${res.data.id}`);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Producer Registration</h2>
            <button onClick={connectWallet}>
                {wallet ? `Wallet Connected: ${wallet}` : "Connect Wallet"}
            </button>
            <br /><br />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            /><br /><br />
            <input
                type="number"
                placeholder="Plant Capacity"
                value={plantCapacity}
                onChange={e => setPlantCapacity(e.target.value)}
            /><br /><br />
            <button onClick={registerProducer}>Register</button>
        </div>
    );
}

export default Registration;
