import React, {useEffect} from "react";
import { ethers } from "ethers";
import './App.css';

const getEthereumObject = () => window.ethereum;

export default function App() {

  const wave = () => {
    
  }
  useEffect(()=>{
    const ethereum = getEthereumObject();
    if(!ethereum){
      console.log('Are you logged onto metamask?');
    }
    else{
      console.log('Ethereum object is: ', ethereum);
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
      </div>
    </div>
  );
}
