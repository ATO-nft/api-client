import { useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { Body, Button, Header, SuperButton } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";
import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";

// import { getDefaultProvider } from "@ethersproject/providers";

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
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        
      } catch (err) {
        // setAccount("");
        console.error(err);
      }
    }
    fetchAccount();    
  },);

  async function mint() {
    try {
      // const defaultProvider = getDefaultProvider(4);
      const signer = provider.getSigner(0);


      const loderunner = new Contract(addresses.lodeRunner, abis.loderunner, signer);
      const to = account;
      const uri = "bafkreib23kegjhehve76nczruvq5xixyxooe5yu2k6wtyg3meqs2dinoti";

      const mintOne = await loderunner.safeMint(to, uri);
      
      // const idRaw = await mintOne.id();
      // const id = idRaw.toString();
      
      console.log("tx hash:", mintOne.hash);

      console.log("contract address:", loderunner.address);
      console.log("NFT id:", 1);

      //const thistle = new Contract(addresses.thistle, abis.thistle, defaultProvider);
      //const image = await thistle.tokenURI(id);
      
      // console.log("image: ", image);
      // setImg(image);
      
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
        
        <SuperButton onClick={mint}>
          Mint
        </SuperButton>
        
      </Body>
    </div>
  );
}

export default App;