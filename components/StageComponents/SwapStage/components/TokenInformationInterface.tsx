/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "../../../../context";
import { Contract, ConvertFrom, SmartContractManager } from "../../../../Utils";
import { StyledTokenInformationContainer } from "../Styles";
//import { Contract, ConvertFrom, SmartContractManager } from "../Utils";

type tokeninfo = {
    ibcoTotalSupply: number,
    maxSupply: number,
    seuroPrice: number,
    marketCap: number,
    tstSeuroPrice: number
}

// @ts-ignore
export const TokenInformationInterface = ({bondingCurveContract}) => {
    const { web3Provider } = useWeb3Context();
    const StandardTokenContract = SmartContractManager('StandardTokenGateway' as Contract).then((data) =>  data);
    const [tokenInfo, setTokenInfo] = useState<tokeninfo>({
        ibcoTotalSupply: 0,
        maxSupply: 0,
        seuroPrice: 0,
        marketCap: 0,
        tstSeuroPrice: 0,
    });

    useEffect(() => {
        if (web3Provider) {
            getAllTokenInfo();
            getTstSeuroPrice();
        }
    }, [web3Provider]);

    // MAIN FUNCTIONS

    const getAllTokenInfo = async () => {
        // @ts-ignore
        await(await bondingCurveContract).methods.ibcoTotalSupply().call()
            .then((data:never) => {
                data > 0 && getMarketCap(data);

                setTokenInfo(prevState => ({
                    ...prevState,
                    ibcoTotalSupply: data
                }));
            });
        // @ts-ignore
        await(await bondingCurveContract).methods.maxSupply().call()
            .then((data:never) => {
                setTokenInfo(prevState => ({
                    ...prevState,
                    maxSupply: data
                }));
            });
    };

    const getMarketCap = async (ibcoTotalSupply:number)  => {
        // @ts-ignore
        await(await bondingCurveContract).methods.currentBucket().call()
        .then((data:never) => {
            const suroPrice = data['price']
            const marketCap = (suroPrice * ibcoTotalSupply)
            
            setTokenInfo(prevState => ({
                ...prevState,
                seuroPrice: suroPrice,
                marketCap: marketCap
            }));
        }).catch((error:never) => {
            toast.error(`Unable to obtain current price: ${error}`);
        });
    };

    const getTstSeuroPrice = async () => {
        //@ts-ignore
        await (await StandardTokenContract).methods.priceTstEur().call().then((data:never) => {
                setTokenInfo(prevState => ({
                    ...prevState,
                    tstSeuroPrice: data
                }))
            }).catch((error:never) => {
                toast.error(`Unable to retrieve TST / sEURO price: ${error}`)
            })
    };

    return (
        <StyledTokenInformationContainer className="supplyContainer">
            <div>
                <h2>Market Cap:</h2>
                <p>&euro;{((tokenInfo.seuroPrice * tokenInfo.ibcoTotalSupply) / 1000000000000000000000000000000000000).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
            <div>
                <h2>sEURO Price:</h2>
                <p>&euro;{ConvertFrom(tokenInfo.seuroPrice, 18).toFloat().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
            <div>
                <h2>TST/sEURO Price:</h2>
                <p>{((tokenInfo.tstSeuroPrice / 100000000)).toLocaleString(undefined, { minimumFractionDigits: 2 })} sEURO</p>
            </div>
        </StyledTokenInformationContainer>
    )
};
