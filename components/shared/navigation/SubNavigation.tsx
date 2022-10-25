import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { TOKENS } from "../../../Utils";
import { StyledSubNav, StyledSubNavContainer, StyledSubNavIndicatorContainer, StyledSubNavIndicatorInnerPip, StyledSubNavIndicatorOuterPip } from "./styles/SubNavStyles";

const subNavigation = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const routes = [
        {route: 'stage1', canonical: `Get ${TOKENS.DISPLAY.SEURO}`}, 
        {route: 'stage2', canonical: `${TOKENS.DISPLAY.SEURO} Bonding`}, 
        {route: 'stage3', canonical: 'TST Staking'}
    ];

    return (
        <>        
            <StyledSubNavIndicatorContainer>
                {
                    routes.map((route, index) => {
                        const active = router.pathname === `/${route.route}`;

                        return(
                            <StyledSubNavIndicatorOuterPip key={index} className={`${active ? 'activePip' : ''}`}>
                                <StyledSubNavIndicatorInnerPip className={`${active ? 'activePip' : ''}`} />
                            </StyledSubNavIndicatorOuterPip>
                        )
                    })
                }
            </StyledSubNavIndicatorContainer>
            <StyledSubNavContainer>
                {routes.map((route) => {
                    const active = router.pathname === `/${route.route}`;
                    return (
                        // eslint-disable-next-line @next/next/link-passhref
                        <Link href={`/${route.route}`} key={route.route} >
                            <StyledSubNav style={{minHeight: "50px"}} className={`${active ? 'active' : ''}`}>{route.canonical}</StyledSubNav>
                        </Link>
                    )
                })}
            </StyledSubNavContainer>
        </>

    )
}

export default subNavigation;
