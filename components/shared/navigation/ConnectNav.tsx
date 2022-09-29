import React from "react";
import { Web3Button } from "../../../components/shared/uiElements/Web3Button";

const ConnectNav = () => {
    return (
      <>
        <div className="w-full grid md:grid-cols-2 gap-2 mb-20">
          <div className="grid justify-items-start p-4 md:w-4/12 sm:w-6/12">
            <img src='/Images/theStandardLogo.svg' alt='The Standard' width='100%' />
          </div>
          
          <nav className="grid justify-items-end p-4">
            <Web3Button />
          </nav>
        </div>
      </>
    )
}

export default ConnectNav;