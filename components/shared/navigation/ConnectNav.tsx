/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { Web3Button } from "../../../components/shared/uiElements/Web3Button";
import { isMobile } from "react-device-detect";

const ConnectNav = () => {
    const [mobile, setMobile] = useState();

    useEffect(() => {
      //@ts-ignore
      setMobile(isMobile)
    }, [setMobile])

    return (
      <>
        <div className="w-full grid md:grid-cols-2 gap-2 mb-20">

            <div className="grid justify-items-start p-4 lg:w-4/12 md:w-1/12">
              <img src={mobile ? '/Images/theStandardLogoIcon.svg' : '/Images/theStandardLogo.svg'} alt='The Standard' width='100%' />
            </div>

          {!mobile ?  
          <nav className="grid justify-items-end p-4">
            <Web3Button />
          </nav>
          :
          <nav className="grid justify-items-end p-4">
            mobile view
          </nav>
          }
        </div>
      </>
    )
}

export default ConnectNav;