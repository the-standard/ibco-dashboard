/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWeb3Context } from '../../../context'
import React, { 
  useEffect, 
  useState } from 'react'
import { toast } from 'react-toastify';

//Util Helpers
import { 
  Contract, 
  ConvertFrom, 
  ConvertTo,
  SmartContractManager, 
  TokenContractManager, 
  TOKENS,
  Web3Manager} from '../../../Utils';
import Dropdown from '../../shared/uiElements/Dropdown/Dropdown';
import { GetJsonAddresses } from '../../../Utils/ContractManager';

export function Web3SwapInterface() {
  const { address, network } = useWeb3Context();
  const [contractAddresses, setContractAddresses] = useState({});
  const [from, setFrom] = useState('0');
  const [to, setTo] = useState(0.0);
  const [token, setToken] = useState({token: TOKENS.HUMAN_READABLE.ETH, address: ''});
  const [tokenDecimal, setTokenDecimal] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [disabledSend, setDisabledSend] = useState(true);
  const [disabledCheck, setDisabledCheck] = useState(true);
  const [tokenApproved, setTokenApprove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [ddTokens, setDDTokens] = useState({});

  // CONTRACT MANAGER INIT
  const web3Interface = Web3Manager();
  const _network = network?.name || 'goerli';
  const SmartContract = SmartContractManager('SEuroOffering' as Contract, _network).then((data) => data);
  const TokenManager = SmartContractManager('TokenManager' as Contract, _network).then((data) => data);
  const TokenContract = TokenContractManager(token.address, _network).then((data) => data);

  // PRIVATE HELPERS
  const isTokenNotEth = (token:string) => {
    return token !== TOKENS.HUMAN_READABLE.ETH
  }

  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    getContractAddresses();
  }, []);

  useEffect(() => {
    const disabledSend = from !== '' && tokenApproved;
    const disabledCheckState = from !== '';

    setDisabledSend(!disabledSend);
    setDisabledCheck(!disabledCheckState);
  }, [from, to, token, allowance, address, tokenApproved]);

  useEffect(() => {
    if (Object.keys(contractAddresses).length !== 0) {
      const _from:string = from || '0';
      const _deposit:number = ConvertTo(_from, tokenDecimal).toInt();
      //@ts-ignore
      const contractAddress = contractAddresses[_network]['CONTRACT_ADDRESSES']['SEuroOffering'];

      isTokenNotEth(token.token) ? setTokenApprove(_from !== '' && allowance >= _deposit) : setTokenApprove(true);
      //@ts-ignore
      (isTokenNotEth(token.token) && address && contractAddress) && checkAllowance(address, contractAddress);
    }
  }, [network, from])

  useEffect(() => {
    from !== '0' ? getTokenAmount() : setTo(0);
  }, [from, token]);

  useEffect(() => {
    getUsableTokens();
    changeTokenClickHandler(TOKENS.HUMAN_READABLE.ETH);
  }, [address]);

  const getContractAddresses = async () => {
     Object.keys(contractAddresses).length === 0 ? await GetJsonAddresses().then((data) => {
      setContractAddresses(data);
     }) : contractAddresses
  }

  //MAIN FUNCTIONS
  const getUsableTokens = async () => {
    const tokenManager = await (await TokenManager);

    // @ts-ignore
    tokenManager.methods.getAcceptedTokens().call().then((data) => {
      setDDTokens(data);
    }).catch((error:never) => toast.error(`unable to retrieve contract ${error}`));
  }

  const setValueChangeHandler = (data:string) => {
    setFrom(data)
  }

  const checkMaxLength = (inputData: { currentTarget: { value: string | never[]; };}) => {
    // if(inputData.currentTarget.value.slice(0,1) === '-')
    // inputData.currentTarget.value = '0'

    if(inputData.currentTarget.value.length > 8) 
      inputData.currentTarget.value = inputData.currentTarget.value.slice(0, 8);
  }

  const onFocusEvent = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (event.target.value === '' || event.target.value === '0')
      event.target.value = '';
  };

  const changeTokenClickHandler = async (token=TOKENS.HUMAN_READABLE.ETH) => {
    const _from = from || 0;
    //@ts-ignore
    const accounts = await web3Interface.eth.getAccounts().then((data:string[]) => data[0]);
    //@ts-ignore
    const tokenAddress = token !== TOKENS.HUMAN_READABLE.ETH ? await (await TokenManager).methods.get(token).call()
                          .then((data:never) => data['addr'])
                          :
                          accounts;
    //@ts-ignore
    await (await TokenManager).methods.getTokenDecimalFor(token).call().then((decimal:never) => {
      const _decimal = parseInt(decimal) === 0 ? 18 : parseInt(decimal);
      setTokenDecimal(_decimal);
    }).catch((error:never) => toast.error(`unable to retrieve contract ${error}`));

    setTransactionData(null);
    setFrom('0');
    setToken({token: token, address: tokenAddress});

    isTokenNotEth(token) ? allowance < ConvertFrom(_from, tokenDecimal).toInt() && setTokenApprove(false) : setTokenApprove(true);
  }

  const checkAllowance = async (_address:string, _seuroAddress:string) => {
    //@ts-ignore
    await (await TokenContract).methods.allowance(_address, _seuroAddress).call().then((data: React.SetStateAction<number>) => {
        setAllowance(data)
      }).catch((error: never) => {
        return error
      })
  }

  const confirmCurrency = async () => {
    setLoading(true);
    const _depositAmount =  ConvertTo(from, tokenDecimal).raw();
    // @ts-ignore
    const getUserBalance = isTokenNotEth(token.token) ? await web3Interface.eth.getBalance(address) : await (await TokenContract).methods.balanceOf(address);
    const formatUserBalance = ConvertTo(getUserBalance, tokenDecimal).toInt();
    formatUserBalance < parseInt(_depositAmount.toString()) ? 
      toast.error('you do not have enough to cover this swap') 
    :
      isTokenNotEth(token.token) ? 
        (//@ts-ignore
          await (await TokenContract).methods.approve(contractAddresses[network['name']]['CONTRACT_ADDRESSES']['SEuroOffering'], _depositAmount.toString()).send({from: address})
        .then((data: { [x: string]: never; }) => {
          setTokenApprove(true);
          toast.success(`Tokens approved for use: ${data['blockHash']}`);
          setLoading(false);
          return
        })
        .catch((error: never) => {
          setLoading(false);
          setTokenApprove(false);
          toast.error(error);
          return
        }))
    :
      setTokenApprove(true);
  }

  const getTokenAmount = async () => {
    setLoading(true);
    
    const _formattedInt = from !== '' ? ConvertTo(from, tokenDecimal).raw() : 0;
    // @ts-ignore
    await (await SmartContract).methods.readOnlyCalculateSwap(token.token, _formattedInt.toString()).call().then((data) => {
        setLoading(false);
        const bigNumberFrom = ConvertFrom(data, 18).toFloat();
        setTo(bigNumberFrom)
      }).catch((error: never) => {
        setLoading(false);
        toast.error(error);
      });
  }

  const SendTransaction = async () => {
    setLoading(true);
    const _formattedInt = ConvertTo(from, tokenDecimal).toInt();
    isTokenNotEth(token.token) ? 
    // @ts-ignore
    await (await SmartContract).methods.swap(token.token, _formattedInt.toString()).send({from: address})
    .then((data: never) => {
      setLoading(false);
      setTransactionData(data);

      !data['status'] ? toast.error('Transaction error') : toast.success(`transaction successfull ${data['transactionHash']}`);
    }).catch((error: never) => {
      setLoading(false);
      toast.error(error);
    })
    :
    // @ts-ignore
    await (await SmartContract).methods.swapETH().send({from: address, value: _formattedInt})
    .then((data: never) => {
      setLoading(false);
      setTransactionData(data);

      !data['status'] ? toast.error('Transaction error') : toast.success(`transaction successfull ${data['transactionHash']}`);
    }).catch((error: never) => {
      setLoading(false);
      toast.error(error);
    })
  }

  return (
    //TODO: Finish styling for all devices
    <div className="convertInput grid grid-flow-row auto-rows-max p-5 py-8 w-full">
        <>
            <p className="p-0 m-0 text-sm">Converting from</p>
            <div className="container w-full">
              <div className="mb-8 mt-1 flex flex-rows w-full">
                <input className="w-9/12 from" type='number' step="any" min={0} maxLength={5} onInput={checkMaxLength} onChange={e => setValueChangeHandler(e.currentTarget.value)} onFocus={(event) => onFocusEvent(event)} id="from" placeholder='converting from' value={from} />
              <div className="w-3/12">
                {
                  // @ts-ignore
                <Dropdown ddElements={ddTokens} changeHandler={changeTokenClickHandler} defaultValue={TOKENS.HUMAN_READABLE.ETH} />
                }
              </div>
              </div>
            </div>

            <p className="p-0 m-0 text-sm">Converting to</p>
            <div className="mb-8 mt-1 flex flex-rows w-full">
              <input className="w-9/12 px-3 py-2" type='string' readOnly={true} placeholder="Converting to" value={to > 0 ? to.toLocaleString( undefined, { minimumFractionDigits: 2 }) : ''} /> 
              <div className="dropdownSelect p-2 w-3/12 text-center">
                SEURO
              </div>
            </div>
            {
              isTokenNotEth(token.token) ? from !== '0' && from !== '' && allowance < ConvertTo(from, tokenDecimal).toInt() && !tokenApproved && <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledCheck} onClick={() => confirmCurrency()}>{loading ? 'loading...' : 'Approve'} {token.token}</button> : ''
            }
            
            {            
            <button className="flex px-2 py-1 mb-4 font-light justify-center" disabled={disabledSend} onClick={() => SendTransaction()}>{loading ? 'loading...' : 'Swap'}</button>
            }
            {// @ts-ignore
            transactionData && <button className="flex px-2 py-1 font-light justify-center" onClick={() => window.open(`https://${network['name']}.etherscan.io/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</button>
            }
            </>
    </div>
  )
}
