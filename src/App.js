import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

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
      console.log('Accounts in Find MetaMask: ', accounts);
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
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x5A6C7C23d096fF7DA3983508393693fa16f13D1F";
  const contractABI = abi.abi;

  const connectWallet = async () =>{
    try{
      const ethereum = getEthereumObject();
      if(!ethereum){
        alert('Please get MetaMask');
      }
      const accounts = await ethereum.request({
        method:"eth_requestAccounts"
      });

      console.log('Found account: ', accounts[0]);
      setCurrentAccount(accounts[0]);
      console.log('Connected')


    }
    catch(error){
      console.error(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () =>{
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved Total Wave Count: ", count.toNumber());

        const waveTxn = await wavePortalContract.wave("Trying to wave");
        console.log("Mining....", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined ---", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("New count is :", count.toNumber());
      }
      else{
        console.log("Ethereum object does not exist");
      }
    }
    catch(error){
      console.error(error)
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
        await getAllWaves();
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
        {allWaves.map((wave, index) => {
          return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>)
        })}
      </div>
    </div>
  );
}
