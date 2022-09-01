import {Twitter, Youtube, Linkedin, Instagram} from 'react-feather'

const Footer = () => {
    return (
        <footer className="mx-auto text-center mt-10">
            <div className="footerSocialMedia mb-5 text-center flex flex-cols w-1/12 justify-between mx-auto footerNav">
                <a href="https://twitter.com/thestandard_io" rel="noreferrer" target="_blank"><Twitter /></a>
                <a href="https://www.youtube.com/thestandard_io" rel="noreferrer" target="_blank"><Youtube /></a>
                <a href="https://www.linkedin.com/company/the-standard-io" rel="noreferrer" target="_blank"><Linkedin /></a>
                <a href="https://www.instagram.com/thestandard.io/" rel="noreferrer" target="_blank"><Instagram /></a>
            </div>
            <div className="flex flex-cols w-4/12 justify-between mx-auto text-center footerNav">
                <a href="https://www.thestandard.io/" rel="noreferrer" target="_blank">The Standard Protocol</a>
                <a href="https://www.thestandard.io/ecosystem" rel="noreferrer" target="_blank">Ecosystem</a>
                <a href="https://www.thestandard.io/careers" rel="noreferrer" target="_blank">Careers</a>
                <a href="https://www.thestandard.io/faq" rel="noreferrer" target="_blank">FAQ</a>
                <a href="Whitepaper" rel="noreferrer" target="_blank">Whitepaper</a>
                <a href="Blog" rel="noreferrer" target="_blank">Blog</a>
            </div>
            <p>BUILD ID: {process.env.NEXT_PUBLIC_GIT_COMMIT_SHA}</p>
        </footer>
    )
}

export default Footer