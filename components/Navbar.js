import styles from "../styles/Home.module.css"
import Logo from "../public/DexBoard-WB.png"
import Link from 'next/link'
import Image from 'next/image'
import { useContext, useState, useEffect } from "react"
import { Context, pageContext } from "./DexState"


export default function Navbar(props) {
    const [state, setState] = useContext(Context)
    const [pageState, setPageState] = useContext(pageContext)
    const [desktop, setDesktop] = useState(globalThis.innerWidth > 600)
    const pageNumber = 0
    const setPageNumber = props.setPageNumber

    let dexOptionsArray = [
        {
            value: 'uniswap_v2',
            name: 'Uniswap'
        },
        {
            value: 'sushiswap',
            name: 'Sushiswap'
        }
    ]


    const updateMedia = () => {
        setDesktop(window.innerWidth > 600)
    }

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    })

    const handleDexChange = (e) => {

        const selectedDEX = e.target.value


        if (setPageNumber) {
            setPageNumber(pageNumber)
            setState(selectedDEX)
        }

        else {
            setState(selectedDEX)
        }

    }

    const handleSelectedClick = (page) => {

        if (page == 'Overview') {
            setPageState('Overview')
        }

        else if (page == 'Pools') {
            setPageState('Pools')
        }

        else if (page == 'Tokens') {
            setPageState('Tokens')
        }

        else {
            console.log("Nothing is selected!")
        }
    }

    return (
        <header className={styles.navbar} id="myNavbar">
            <div className={styles.navbarLeft}>
                <div className={styles.logo}><Image src={Logo} alt="DexBoard"></Image></div>
                {
                    desktop &&
                    <div className={styles.navbarMenu}>
                        <Link href="/Overview">
                            <a onClick={() => handleSelectedClick('Overview')} className={pageState == 'Overview' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Overview</a>
                        </Link>
                        <Link href="/Pools">
                            <a onClick={() => handleSelectedClick('Pools')} className={pageState == 'Pools' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Pools</a>
                        </Link>
                        <Link href="/Tokens">
                            <a onClick={() => handleSelectedClick('Tokens')} className={pageState == 'Tokens' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Tokens</a>
                        </Link>
                    </div> 
                }
            </div>

            <div className={styles.navbarRight}>

                <select defaultValue={state} onChange={(e) => handleDexChange(e)}>
                    {
                        dexOptionsArray.map((option, index) => (
                            <option value={option.value} key={index}>{option.name}</option>
                        ))
                    }
                </select>

                {
                    desktop === false &&
                    <MobileMenu handleSelectedClick={handleSelectedClick}
                        pageState={pageState}
                    />
                }

            </div>
        </header>
    )

}

function MobileMenu(props) {

    const handleSelectedClick = props.handleSelectedClick
    const pageState = props.pageState

    const [showMenu, setShowMenu] = useState(false)

    let menu

    if(showMenu) {
        menu = <div className={styles.mobileMenu}>
            <Link href='/Overview'>
                <a onClick={() => handleSelectedClick('Overview')} className={pageState == 'Overview' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Overview</a>
            </Link>
            <Link href='/Pools'>
                <a onClick={() => handleSelectedClick('Pools')} className={pageState == 'Pools' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Pools</a>
            </Link>
            <Link href='/Tokens'>
                <a onClick={() => handleSelectedClick('Tokens')} className={pageState == 'Tokens' ? styles.navBarMenuItemActive : styles.navbarMenuItem}>Tokens</a>
            </Link>
        </div>
    }

    return (
        <header>
            <span>
                <button onClick={() => setShowMenu(!showMenu)} className={styles.mobileMenuButton}>
                    {
                        showMenu ?
                        <svg viewBox="0 0 50 50" width="12" height="20" overflow='visible' stroke='#222831' strokeWidth='10' strokeLinecap='round'>
                            <line x2='50' y2='50' />
                            <line x1='50' y2='50' />
                        </svg> :
                        <svg viewBox="0 0 100 80" width="12" height="20">
                            <rect width="100" height="20"></rect>
                            <rect y="30" width="100" height="20"></rect>
                            <rect y="60" width="100" height="20"></rect>
                        </svg> 
                    }
                </button>
            </span>
            {menu}
        </header>
    )
}