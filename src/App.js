import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';

const getEthereumObject = () => window.ethereum;
const findMetaMaskAccount = async () =>{
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log('No metamask');
      return null;
    }

    const accounts = await ethereum.request({method: "eth_accounts"});
    if (accounts.length !== 0) {
      const account = accounts[0];
      return account;
    } else {
      console.error("no authorized account found");
      return null;
    }
  }
  catch(error){
    console.error(error);
    return null;
  }
}
export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const wave = () => {
    
  }
  const connectWallet = async () =>{
    try{
      const ethereum = getEthereumObject();
      if(!ethereum){
        alert('Please get MetaMask');
      }
      const accounts = await ethereum.request({
        method:"eth_accounts"
      });

      console.log('Found account: ', accounts[0]);
      setCurrentAccount(accounts[0]);
      console.log('Connected')
    }
    catch(error){
      console.error(error);
    }
  }
  useEffect(async ()=>{
    const ethereum = getEthereumObject();
    if(!ethereum){
      console.log('Are you logged onto metamask?');
    }
    else{
      console.log('Ethereum object is: ', ethereum);
      const account = await findMetaMaskAccount();
      if(account!==null){
        setCurrentAccount(account);
      }
    }
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Ronak and I work as an engineer that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
        )}
      </div>
    </div>
  );
}
