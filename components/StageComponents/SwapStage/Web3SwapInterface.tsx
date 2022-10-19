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
import { StyledInputContainers, StyledPContainer, StyledSwapButton, StyledSwapInterfaceContainer } from './Styles';

export function Web3SwapInterface() {
  const { address, network, web3Provider } = useWeb3Context();
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
  const [_network, setNetwork] = useState<string>();
  const [etherscanUrl, setEtherscanUrl] = useState<string>();

  // CONTRACT MANAGER INIT
  const web3Interface = Web3Manager();
  //@ts-ignore
  const SmartContract = SmartContractManager('SEuroOffering' as Contract).then((data) => data);
  //@ts-ignore
  const TokenManager = SmartContractManager('TokenManager' as Contract).then((data) => data);
  //@ts-ignore
  const TokenContract = TokenContractManager(token.address).then((data) => data);

  // PRIVATE HELPERS
  const isTokenNotEth = (token:string) => {
    return token !== TOKENS.HUMAN_READABLE.ETH
  }

  // MAIN UPDATE FUNCTIONS
  useEffect(() => {
    if (_network === undefined) {
      setNetwork(network?.name === 'homestead' ? 'main' : network?.name);
      setEtherscanUrl(network?.name === 'homestead' ? 'https://etherscan.io' : `https://${network?.name}.etherscan.io`);
    } 

    getContractAddresses();
  }, [network]);

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
      const contractAddress = getSeuroAddress();
      isTokenNotEth(token.token) ? setTokenApprove(_from !== '' && allowance >= _deposit) : setTokenApprove(true);
      //@ts-ignore
      isTokenNotEth(token.token) && checkAllowance(address, contractAddress);
    }
  }, [from])

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

  const getSeuroAddress = () => {
    //@ts-ignore
    const contractAddress = contractAddresses[_network]['CONTRACT_ADDRESSES']['SEuroOffering'];
    return contractAddress;
  }

  //MAIN FUNCTIONS
  const getUsableTokens = async () => {
    const tokenManager = await TokenManager;
    // @ts-ignore
    web3Provider !== undefined && tokenManager.methods.getAcceptedTokens().call().then((data) => {
      setDDTokens(data);
    }).catch((err:never) => console.log('error getAceptedTokens', err));
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
    const accounts = web3Provider && await web3Interface.eth.getAccounts().then((data:string[]) => data[0]);
    //@ts-ignore
    const tokenAddress = token !== TOKENS.HUMAN_READABLE.ETH ? await (await TokenManager).methods.get(token).call()
                          .then((data:never) => data['addr'])
                          :
                          accounts;
    //@ts-ignore
    web3Provider !== undefined && await (await TokenManager).methods.getTokenDecimalFor(token).call().then((decimal:never) => {
      const _decimal = parseInt(decimal) === 0 ? 18 : parseInt(decimal);
      setTokenDecimal(_decimal);
    });
    

    setTransactionData(null);
    setFrom('0');
    setToken({token: token, address: tokenAddress});

    isTokenNotEth(token) ? allowance < ConvertFrom(_from, tokenDecimal).toInt() && setTokenApprove(false) : setTokenApprove(true);
  }

  const checkAllowance = async (_address:string, _seuroAddress:string) => {
    //@ts-ignore
    await (await TokenContract).methods.allowance(_address, _seuroAddress).call().then((data: React.SetStateAction<number>) => {
      setAllowance(data)
    });
  }

  const confirmCurrency = async () => {
    setLoading(true);
    const _depositAmount =  ConvertTo(from, tokenDecimal).raw();
    // @ts-ignore
    const getUserBalance = isTokenNotEth(token.token) ? await web3Interface.eth.getBalance(address) : await (await TokenContract).methods.balanceOf(address);
    const formatUserBalance = ConvertTo(getUserBalance, tokenDecimal).toInt();
    formatUserBalance < parseInt(_depositAmount.toString()) ? 
      toast.error('Insufficient funds for swap') 
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
        .catch(() => {
          setLoading(false);
          setTokenApprove(false);
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
      }).catch(() => {
        setLoading(false);
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

      !data['status'] ? toast.error('Transaction error') : toast.success(`Transaction successful ${data['transactionHash']}`);
    }).catch(() => {
      setLoading(false);
    })
    :
    // @ts-ignore
    await (await SmartContract).methods.swapETH().send({from: address, value: _formattedInt})
    .then((data: never) => {
      setLoading(false);
      setTransactionData(data);

      !data['status'] ? toast.error('Transaction error') : toast.success(`Transaction successful ${data['transactionHash']}`);
    }).catch(() => {
      setLoading(false);
    })
  }

  return (
    <StyledSwapInterfaceContainer>
        <>
            <StyledPContainer>Converting from</StyledPContainer>
              <StyledInputContainers>
                <input type='number' step="any" min={0} maxLength={5} onInput={checkMaxLength} onChange={e => setValueChangeHandler(e.currentTarget.value)} onFocus={(event) => onFocusEvent(event)} id="from" placeholder='0' value={from} />
                  {
                    // @ts-ignore
                  <Dropdown ddElements={ddTokens} changeHandler={changeTokenClickHandler} defaultValue={TOKENS.HUMAN_READABLE.ETH} />
                  }
              </StyledInputContainers>

              <StyledPContainer>Converting to</StyledPContainer>
              <StyledInputContainers>
                <input type='string' readOnly={true} placeholder="0" value={to > 0 ? to.toLocaleString( undefined, { minimumFractionDigits: 2 }) : ''} /> 
                <div className="dropdownSelect readOnly">
                  {TOKENS.DISPLAY.SEURO}
                </div>
              </StyledInputContainers>
            {
              isTokenNotEth(token.token) ? from !== '0' && from !== '' && allowance < ConvertTo(from, tokenDecimal).toInt() && !tokenApproved && <StyledSwapButton className="extraMarginTop" disabled={disabledCheck} onClick={() => confirmCurrency()}>{loading ? 'loading...' : 'Approve'} {token.token}</StyledSwapButton> : ''
            }
            
            {            
            web3Provider && <StyledSwapButton disabled={disabledSend} onClick={() => SendTransaction()}>{loading ? 'loading...' : 'Swap'}</StyledSwapButton>
            }
            {// @ts-ignore
            transactionData && <StyledSwapButton onClick={() => window.open(`${etherscanUrl}/tx/${transactionData['transactionHash']}`,"_blank")}>Show Transaction</StyledSwapButton>
            }
            </>
    </StyledSwapInterfaceContainer>
  )
}
