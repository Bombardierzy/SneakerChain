import React, { ReactElement, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Gauge from "./Gauge";
import { web3 } from "../../Contract"
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';

import { ContractContext } from "../../Contract";
import { Console } from "console";

// This component should be responsible for loading wallets from MetaMask
export function Home(): ReactElement {
  const contract = useContext(ContractContext);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("ETH");
  const [amount, setAmount] = useState(30);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  // const loadWallet = async () => {
  //   const {result: accounts} = await window.ethereum.send("eth_requestAccounts");
  //   console.log("Your wallet address", accounts[0]);
  //   contract.methods.requestManufacturerRole().send({from: accounts[0], gas: 500000, value: 1});
  // }

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const {
          result: [account],
        } = await window.ethereum.send("eth_requestAccounts");
        setAccount(account);
        setAmount(parseInt( await web3.eth.getBalance(account)))
      } catch (error) {
        setError("Error happened while fetching wallet!");
      }
    };

    fetchWallet();
  }, []);

  const useStyles = makeStyles((theme) => ({
    header: {
      display: "flex",
      justifyContent: "center",
      marginTop: 10,
      fontSize: 30
    }
  }));
  const classes = useStyles();


  return (
    <div>
      <MDBContainer>
        <MDBRow>
          <MDBCol md="6">
          <div className={classes.header}>
            Wallet Balance
          </div>
          <div>
            <Gauge
            amount={amount}
            angle={`rotate(${(amount * 180) / max}deg)`}
            currency={currency}
            min={min}
            max={max}/>
          </div>
          </MDBCol>
          <MDBCol md="6">
            <form>
              <p className="h4 text-center mb-4">Check sneaker</p>
              <label htmlFor="manufacturerNameLabel" className="grey-text">
                Manufacturer name
              </label>
              <input type="text" id="manufacturerName" className="form-control" />
              <br />
              <label htmlFor="modelNameLabel" className="grey-text">
                Model name
              </label>
              <input type="text" id="modelName" className="form-control" />
              <br />
              <label htmlFor="modelIdLabel" className="grey-text">
                Model id
              </label>
              <input type="text" id="modelId" className="form-control" />
              <br />
              <label htmlFor="sneakerSizeLabel" className="grey-text">
                Sneaker size
              </label>
              <input type="number" id="sneakerSize" className="form-control" />
              <br />
              <label htmlFor="sellerIdLabel" className="grey-text">
                Seller id
              </label>
              <input type="text" id="sellerId" className="form-control" />
              <div className="text-center mt-4">
                <MDBBtn color="unique" type="submit" style={{color: "white"}}>
                  Check
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
        
      </MDBContainer>
    </div>
  );
}
