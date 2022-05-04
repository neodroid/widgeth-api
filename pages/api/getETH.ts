import axios from "axios";
import { add, get, orderBy } from "lodash";
import { ethers } from "ethers";
import { useState } from "react";
import { getJsonWalletAddress } from "ethers/lib/utils";


// const [walletId, setWalletId] = useState<string>("");
// const [ensAddress, setEnsAddress] = useState<string>();

const api = axios.create({
  headers: {
    Accept: "application/json",
  },
  timeout: 20000, // 20 secs
});

export const apiGetERC20Tokens = async (address: string) => {

  
  const walletAddress = await getWeb3(address)


  const url = `https://api.ethplorer.io/getAddressInfo/${walletAddress}?apiKey=freekey`;
  const data = await api.get(url);
  const eth = get(data, "data.ETH", null);
  const erc20s = get(data, "data.tokens", []);
  const filteredErc20s = erc20s.filter((token: any) => token.tokenInfo.price);
  const orderedErc20s = orderBy(filteredErc20s, ["tokenInfo.symbol"], ["asc"]);
  const checksumErc20s = orderedErc20s.map((token: any) => ({
    ...token,
    tokenInfo: {
      ...token.tokenInfo,
      address: ethers.utils.getAddress(token.tokenInfo.address),
      balance_usd: parseFloat((roundToDecimal(token.balance / Math.pow(10, token.tokenInfo.decimals), 3) * token.tokenInfo.price.rate).toFixed(2))
    },
  }));
  let total_balance = 0
  checksumErc20s.map(x=> x.tokenInfo.balance_usd>0 ?total_balance = total_balance + x.tokenInfo.balance_usd: total_balance = total_balance+0)

  // total_balance += (eth.balance * eth.price.rate)
  const string_balance = dollarFormatter.format(total_balance) 
  return [eth, checksumErc20s, string_balance];
};

// export const apiGetERC20Tokens = (address: string) => {

//     return address
// };

export const roundToDecimal = (num: number, decimalPlaces: number) =>
  Number(
    Math.round(Number(num + "e" + decimalPlaces)) + "e" + decimalPlaces * -1
  );

  export const dollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const getWeb3 = async (address: string) => {
    let addressParam;
    const provider = new ethers.providers.InfuraProvider(
      1,"527022fbef204db5af7aee003c868529"
    );
    if (address.length === 42) {
      return address
    } else if (address.slice(address.length-4) === ".eth") {
      const walletAddress = await provider.resolveName(address);
      return walletAddress
    }else {
      addressParam = address + ".eth";
      const walletAddress = await provider.resolveName(addressParam);
      return walletAddress
    }
     
  };