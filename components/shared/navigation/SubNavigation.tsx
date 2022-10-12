import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { TOKENS } from "../../../Utils";
import { StyledSubNav } from "./styles/SubNavStyles";

const subNavigation = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const routes = [
        {route: 'stage1', canonical: `Get ${TOKENS.DISPLAY.SEURO}`}, 
        {route: 'stage2', canonical: `${TOKENS.DISPLAY.SEURO} Bonding`}, 
        {route: 'stage3', canonical: 'TST Staking'}
    ];
    const baseClasses = 'subnav text-lg font-light m-4';

    return (
        <nav className="flex flex-column justify-center p-4">
            {routes.map((route) => {
                const active = router.pathname === `/${route.route}`;
                return (
                    // eslint-disable-next-line @next/next/link-passhref
                    <Link href={`/${route.route}`} key={route.route}>
                        <StyledSubNav className={`${baseClasses} ${active ? 'active' : ''}`}>{route.canonical}</StyledSubNav>
                    </Link>
                )
            })}
        </nav>
    )
}

export default subNavigation;