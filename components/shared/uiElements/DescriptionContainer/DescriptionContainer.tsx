import React, { ReactNode } from "react";

import { StyledDescriptionContainer, StyledDescriptionParagraph } from "./DescriptionContainerStyles";

interface Props {
    children?: ReactNode,
}

const DescriptionContainer = ({children}:Props) => {

    return (
        <StyledDescriptionContainer>
            <StyledDescriptionParagraph>{children}</StyledDescriptionParagraph>
        </StyledDescriptionContainer>
    )
}

export default DescriptionContainer;