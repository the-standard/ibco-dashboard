/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { ChevronLeft } from 'react-feather';

type BondingHistoryInterfaceType = {
    backButton: React.MouseEventHandler<string>,
}

export const BondingHistoryInterface = ({backButton}:BondingHistoryInterfaceType) => {

    return(
        <>        
            {
                // @ts-ignore
                <div className="mb-4 w-4/12"><a href="#" className="py-1 flex backButton" onClick={backButton}><span className="flex w-5"><ChevronLeft /></span> Back</a></div>
            }
            
            <div>Bonding History Interface</div>
        </>

    )
};