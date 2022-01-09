import { useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { Body, Button, Header, SuperButton } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {

  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        const name = await provider.lookupAddress(accounts[0]);

        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  // const [account, setAccount] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        // const accounts = await provider.listAccounts();
        // setAccount(accounts[0]);
        
      } catch (err) {
        // setAccount("");
        console.error(err);
      }
    }
    fetchAccount();    
  },);

  async function request() {

    // TO DO: add static values

    const form = document.querySelector('form');
		form.addEventListener('submit', handleSubmit);
		var httpRequest;

		function handleSubmit(event) {
			event.preventDefault();
			const data = new FormData(event.target);
			// const value = data.get('FileName');
			//console.log('fileName: ', value);
			const valueAll = Object.fromEntries(data.entries());

			const source = { CheckValues: "N" };
			Object.assign(valueAll, source);
			//console.log('valueAll: ', valueAll);

			console.log('JSON valueAll: ', JSON.stringify(valueAll));
			makeRequest(JSON.stringify(valueAll));
			return false; //don't submit
		}

		// method="POST" action="http://localhost:8080" target="_blank"
		function makeRequest(JSONValues) {
			httpRequest = new XMLHttpRequest();
			if (!httpRequest) {
				alert('Abandon :( Impossible de créer une instance de XMLHTTP');
				return false;
			}
			httpRequest.onreadystatechange = alertContents;
			httpRequest.open('POST', 'http://localhost:8080');
			httpRequest.send(JSONValues);
		}

		function alertContents() {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					alert(httpRequest.responseText);
				} else {
					alert(httpRequest.responseText);
					//alert('Il y a eu un problème avec la requête.');
				}
			}
		}

    try {
      
    } catch (err) {
      console.error(err);
    } finally {
      
    }
  }  

  

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      // console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <p>
          Status: <strong>all parameters set</strong>
        </p>
        
        <SuperButton onClick={request}>
          Download PDF
        </SuperButton>
        
      </Body>
    </div>
  );
}

export default App;