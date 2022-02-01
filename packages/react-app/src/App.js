import { useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { Body, Button, Header, SuperButton } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import GET_TRANSFERS from "./graphql/subgraph";
import { addresses, abis } from "@project/contracts";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { metadata } from "./components/metadata.js";
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js'

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

console.log("metadata: ", metadata);

function App() {
  
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [account, setAccount] = useState("");
  const [txBeingSent, setTxBeingSent] = useState(false);
  // const [x, setX] = useState("");

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

      function getAccessToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVFYkNDMTBGMDE2MUM1YzU4YzE5MmM3RjgxZmIzRjVGNDhmZDAwQkYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDM0NzAxOTUwNDUsIm5hbWUiOiJhdG8tYXBpLWNsaWVudCJ9.EJuce0duCNhdQscba4r66-qC5ikdx9UlvJLrUfFV8Nw"
      }
      
      function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
      }
      
      function makeFileObjects() {
      
        const obj = metadata
        const buffer = Buffer.from(JSON.stringify(obj));
      
        const files = [
          // new File(['contents-of-file-1'], 'plain-utf8.txt'),
          new File([buffer], 'meta.json')
        ]
        return files
      }
      
      async function storeFiles(files) {
        const client = makeStorageClient()
        const cid = await client.put(files)
        console.log('stored files with cid:', cid)
        
        return cid
      }

      // https://ipfs.io/ipfs/bafybeic5z3fbpamhqrbpl4swmqer4n4ogpbrrwow27qytlxzbbbysrd67y/meta.json

      // TO DO: check if user is on the right network
      const defaultProvider = getDefaultProvider(4);
      console.log("defaultProvider", defaultProvider);

      setTxBeingSent(true);
      const signer = provider.getSigner(0);
      const loderunner = new Contract(addresses.lodeRunner, abis.loderunner, signer);

      const uriRaw = await storeFiles(makeFileObjects())
      const uri = uriRaw + "/meta.json";

      console.log("uriRaw:", uriRaw);
      console.log("uri:", uri);

      const mintOne = await loderunner.safeMint(account, uri);

      const receipt = await mintOne.wait();

      if (receipt.status === 0) {
          throw new Error("Failed");
      }
      
      console.log("tx hash:", mintOne.hash);
      console.log("contract address:", loderunner.address);
      
      // TO DO: retrieve the ID of the NFT that was just minted (to redirect user to opensea)

    } catch (err) {
      console.error(err);
    } finally {
      setTxBeingSent(false);      
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

        {txBeingSent === true &&
        <p>
          Processing... 😉
        </p>
        }
        
        <SuperButton onClick={mint}>
          Mint
        </SuperButton>
        
      </Body>
    </div>
  );
}

export default App;