/* eslint-disable @next/next/inline-script-id */
import Head from 'next/head'

interface HeadProps {
    title: string,
    description:string,
}

const NextHeadComponent = ({title, description}:HeadProps) => {
    return (
        // eslint-disable-next-line @next/next/no-script-component-in-head
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
    
}

export default NextHeadComponent