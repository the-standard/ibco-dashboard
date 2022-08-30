import Head from 'next/head'

interface HeadProps {
    title: string,
    description:string,
}

const NextHeadComponent = ({title, description}:HeadProps) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
    
}

export default NextHeadComponent