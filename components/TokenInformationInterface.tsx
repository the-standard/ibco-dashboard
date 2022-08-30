/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "../context";
import { Contract, SmartContractManager } from "../Utils";
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
    const { web3Provider, network } = useWeb3Context();
    const _network = network?.name || 'goerli';
    const StandardTokenContract = SmartContractManager('StandardTokenGateway' as Contract, _network).then((data) => { return data });
    const [tokenInfo, setTokenInfo] = useState<tokeninfo>({
        ibcoTotalSupply: 0,
        maxSupply: 0,
        seuroPrice: 0,
        marketCap: 0,
        tstSeuroPrice: 0,
    });

    useEffect(() => {
        getAllTokenInfo();
        getTstSeuroPrice();
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
            }).catch((error:never) => {
                toast.error(`unable to obtain ibcoTotalSupply: ${error}`);
            });
        // @ts-ignore
        await(await bondingCurveContract).methods.maxSupply().call()
            .then((data:never) => {
                setTokenInfo(prevState => ({
                    ...prevState,
                    maxSupply: data
                }));
            }).catch((error:never) => {
                toast.error(`unable to obtain maxSupply: ${error}`);
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
            toast.error(`unable to obtain currentBucket: ${error}`);
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
                toast.error(`unable to activate contract interface: ${error}`)
            })
    };

    return (
        <div className="grid grid-cols-3 gap-4 content-start mb-4 mr-6 p-5 supplyContainer">
            <div>
                <h2>Market Cap</h2>
                <p>&euro; {((tokenInfo.marketCap / 1000000000000000000) / 10000000000000000).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
            <div>
                <h2>sEURO Price</h2>
                <p>&euro; {((tokenInfo.seuroPrice / 1000000000000000000)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
                <h2>TST/sEURO Price</h2>
                <p>&euro; {((tokenInfo.tstSeuroPrice / 1000000)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
        </div>
    )
};