/* eslint-disable @typescript-eslint/ban-ts-comment */
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "../../../../context";
import { StakingContractManager, ConvertFrom, TOKENS, TokenContractManager } from "../../../../Utils";
import { StyledStakeButton, StyledStakingHistorySelector } from "../styles/StakingListStyles";

const defaultTokenObj = {
    tokenAddress: '',
    symbol: '',
    decimal: 18
}

type StakingObj = {
    stake: {
        address: string,
        nonce: string,
        tokenId : string,
        open : string,
        stake : string,
        reward : string,
    }
}

type TokenInformationType = {
    tokenAddress: string,
    symbol: string,
    decimal: number
}

export const StakingHistoryListSelector = (stake:StakingObj) => {
    const StakingObj = stake.stake;
    const { network, address } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const stakingContractInit = StakingContractManager(StakingObj.address).then((data) => data);

    const [tstTokenInfo, setTstTokenInfo] = useState<TokenInformationType>(defaultTokenObj);
    const [seuroTokenInfo, setseuroTokenInfo] = useState<TokenInformationType>(defaultTokenObj);
    const [tokenAddresses, setTokenAddresses] = useState({SEURO_ADDRESS: '', TST_ADDRESS: ''});
    const [stakeInfo, setStakeInfo] = useState({maturity: 0});
    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTokenAddresses();
    }, [stakingContractInit !== null, claimed]);

    useEffect(() => {
        if (tokenAddresses.SEURO_ADDRESS !== '' && tokenAddresses.TST_ADDRESS !== '') {
            getTokenInformation(tokenAddresses.SEURO_ADDRESS).then((data) => {
                //@ts-ignore
                setseuroTokenInfo(prevState => ({...prevState, decimals: data.decimals, symbol: data.symbol}))
            });

            getTokenInformation(tokenAddresses.TST_ADDRESS).then((data) => {
                //@ts-ignore
                setTstTokenInfo(prevState => ({...prevState, decimals: data.decimals, symbol: data.symbol}))
            });
        }
    }, [tokenAddresses])

    const getTokenAddresses = async () => {
        const stakingContract = await stakingContractInit;

        if (stakingContract) {
            stakingContract.methods.SEURO_ADDRESS().call().then((data:never) => {
                setTokenAddresses(prevState => ({...prevState, SEURO_ADDRESS: data}));
            });

            stakingContract.methods.TST_ADDRESS().call().then((data:never) => {
                setTokenAddresses(prevState => ({...prevState, TST_ADDRESS: data}));
            });

            stakingContract.methods.maturity().call().then((data:never) => {
                setStakeInfo(prevState => ({...prevState, maturity: parseInt(data)*1000}));
            });
        }
    }

    const getTokenInformation = async (address:string) => {
        //@ts-ignore
        const tokenContractInit = TokenContractManager(address, _network).then((data:never) => data);

        const tokenInfoObj = {
            decimals: 0,
            symbol: ''
        };

        //@ts-ignore
        await(await tokenContractInit).methods.symbol().call().then((data:never) => {
            tokenInfoObj.symbol = data;
        });
        //@ts-ignore
        await(await tokenContractInit).methods.decimals().call().then((data:never) => {
            tokenInfoObj.decimals = parseInt(data);
        });

        return tokenInfoObj;
    };

    const claimStake = async () => {
        setLoading(true);
        const stakingContract = await stakingContractInit;

        //@ts-ignore
        stakingContract.methods.burn().send({from: address}).then(() => {
            setLoading(false);
            toast.success(`Successfully claimed ${ConvertFrom(StakingObj.reward, parseInt(seuroTokenInfo.decimal.toString())).toFloat()} ${TOKENS.DISPLAY.SEURO}`);
            setClaimed(true);
        })
        .catch(() => {
            setLoading(false);
            setClaimed(false);
        });
    }

    return (
        <StyledStakingHistorySelector>
            <span>{ConvertFrom(StakingObj.stake, parseInt(tstTokenInfo.decimal.toString())).toFloat()} {tstTokenInfo.symbol}</span>
            <span>{ConvertFrom(StakingObj.reward, parseInt(seuroTokenInfo.decimal.toString())).toFloat()} {TOKENS.DISPLAY.SEURO}</span>
            <span>{
            //@ts-ignore
            moment(parseInt(stakeInfo.maturity)).format('ll')
            }</span>
            <span>&nbsp;</span>
            <span>{
                //@ts-ignore
                moment().isSameOrAfter(moment(parseInt(stakeInfo.maturity))) ? <StyledStakeButton onClick={() => claimStake()}>{!loading ? 'Claim' : 'Loading...'}</StyledStakeButton> : claimed ? <p>Already Claimed</p> : <p>Pending</p>
            }</span>
        </StyledStakingHistorySelector>
    )
}