import styles from "../styles/Home.module.css"
import Image from "next/image"
import Link from "next/link"
import covalentLogo from "../public/Covalent_Wordmark_Three_Color.png"

export default function Footer() {
    
    return (
        <footer className={styles.footer}>
            <Link href='https://www.covalenthq.com/'>
                <a target="_blank" rel="noopener noreferrer">
                    <div className={styles.footerPoweredBy}>
                        <div>Powered by </div>
                        <div><Image src={covalentLogo}/></div>
                    </div>
                </a>
            </Link>
        </footer>
    )

}