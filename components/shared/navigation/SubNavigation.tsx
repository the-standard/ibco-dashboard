import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const subNavigation = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const routes = [
        {route: 'stage1', canonical: 'Get sEURO'}, 
        {route: 'stage2', canonical: 'sEURO Bonding'}, 
        {route: 'stage3', canonical: 'TST Staking'}
    ];
    const baseClasses = 'subnav text-lg font-light m-4';

    return (
        <nav className="flex flex-column justify-center p-4">
            {routes.map((route) => {
                const active = router.pathname === `/${route.route}`;
                return (
                    <Link href={`/${route.route}`} key={route.route}>
                        <a className={`${baseClasses} ${active ? 'active' : ''}`}>{route.canonical}</a>
                    </Link>
                )
            })}
        </nav>
    )
}

export default subNavigation;