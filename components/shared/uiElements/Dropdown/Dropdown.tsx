import React from "react";

interface DropdownInterface {
    ddElements: string[],
    changeHandler: (value:string) => void,
    defaultValue: string,
}  

const Dropdown = ({ddElements, changeHandler, defaultValue}: DropdownInterface) => {
    return (
        <select onChange={(e) => changeHandler(e.currentTarget.value) } className="dropdownSelect w-full text-center" defaultValue={defaultValue}>
            <option value='ETH' key='ETH'>ETH</option>
        {   
            ddElements.length > 0 && ddElements.map((elem) => {
                return <option value={elem} key={elem}>{elem}</option>
            })
        }
        </select>
    )
}

export default Dropdown;