import styles from "../styles/Home.module.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import { getDEXTokens } from "../data";
import { useContext, useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import { Context } from "../components/DexState";
import Link from "next/link";
import Loader from "../components/Loader";
import FailToLoad from "../components/FailToLoad";


export default function Tokens() {

    const [state, setState] = useContext(Context)
    const [pageNumber, setPageNumber] = useState(0)
    const [order, setOrder] = useState('ASC')
    const [trackColumn, setTrackColumn] = useState('total_liquidity_quote')
    const [desktop, setDesktop] = useState(globalThis.innerWidth > 600)

    const { data, isLoading, isError } = getDEXTokens(state, pageNumber);


    const updateMedia = () => {
        setDesktop(window.innerWidth > 600)
    }

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    })

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
    });


    const sortData = (col) => {
        if (order === 'ASC') {
            data.data.items.sort((a, b) =>
                a[col] > b[col] ? 1 : -1
            );
            setOrder('DSC')
            setTrackColumn(col)
        }

        if (order === 'DSC') {
            data.data.items.sort((a, b) =>
                a[col] < b[col] ? 1 : -1
            );
            setOrder('ASC')
            setTrackColumn(col)
        }
    }


    const chooseRender = () => {
        if (isLoading) {
            return (
                <div className={styles.skeleton}>
                    <Loader />
                </div>
            )
        }

        else if (isError) {
            return (
                <FailToLoad />
            )
        }

        else {
            return (
                <div>
                    <div className={styles.title}>All Tokens</div>
                    <table className={styles.table}>

                        <thead>
                            <tr className={styles.tableHead}>
                                <th>#</th>
                                <th>Name</th>
                                <th onClick={() => sortData('quote_rate')}>Quote (USD)
                                    <div style={{ display: trackColumn == 'quote_rate' ? '' : 'none' }}>
                                        {order == 'ASC' ? '⬇' : '⬆'}
                                    </div>
                                </th>
                                {
                                    desktop &&
                                    <th onClick={() => sortData('swap_count_24h')}>Swaps 24h
                                        <div style={{ display: trackColumn == 'swap_count_24h' ? '' : 'none' }}>
                                            {order == 'ASC' ? '⬇' : '⬆'}
                                        </div>
                                    </th>
                                }
                                <th onClick={() => sortData('total_volume_24h_quote')}>Volume 24h (USD)
                                    <div style={{ display: trackColumn == 'total_volume_24h_quote' ? '' : 'none' }}>
                                        {order == 'ASC' ? '⬇' : '⬆'}
                                    </div>
                                </th>
                                {
                                    desktop &&
                                    <th onClick={() => sortData('total_liquidity_quote')}>Total Liquidity (USD)
                                        <div style={{ display: trackColumn == 'total_liquidity_quote' ? '' : 'none' }}>
                                            {order == 'ASC' ? '⬇' : '⬆'}
                                        </div>
                                    </th>
                                }
                            </tr>
                        </thead>

                        <tbody>
                            {
                                data?.data?.items?.map((item, index) => (
                                    <Link href={{ pathname: '/TokenExplorer', query: item }} key={index}>
                                        <tr className={styles.tableRow} style={{ cursor: 'pointer' }} key={index}>
                                            <td>{10 * pageNumber + index + 1}</td>
                                            <td>{item.contract_name}&nbsp;&nbsp;{desktop && <>({item.contract_ticker_symbol})</>}</td>
                                            <td>{item.quote_rate ? formatter.format(item.quote_rate) : 0}</td>
                                            {
                                                desktop &&
                                                <td>{item.swap_count_24h}</td>
                                            }
                                            <td>{item.total_volume_24h_quote ? formatter.format(item.total_volume_24h_quote).split('.')[0] : 0}</td>
                                            {
                                                desktop &&
                                                <td>{item.total_liquidity_quote ? formatter.format(item.total_liquidity_quote).split('.')[0] : 0}</td>
                                            }
                                        </tr>
                                    </Link>
                                ))
                            }
                        </tbody>

                        <tfoot className={styles.tableFoot}>
                            <tr>
                                <Pagination pageNumber={pageNumber}
                                    data={data}
                                    setPageNumber={setPageNumber}
                                />
                            </tr>
                        </tfoot>

                    </table>
                </div>
            )
        }
    }

    return (

        <>
            <Navbar setPageNumber={setPageNumber} />
            <main className={styles.main}>
                {chooseRender()}
            </main>
            <Footer />
        </>

    )

}