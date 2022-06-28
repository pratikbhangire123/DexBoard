import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { getHistoricalTokenPrices, getTokenTransactions } from "../data"
import styles from "../styles/Home.module.css"
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2"
import Link from "next/link"
import { Context } from "../components/DexState"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
import FailToLoad from "../components/FailToLoad"


export default function TokenExplorer() {

    const router = useRouter()
    const item = router.query

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
    })


    const [state, setState] = useContext(Context)
    const [tokenAddress, setTokenAddress] = useState(item?.contract_address)


    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.tokenExplorerNavigation}>
                    <div className={styles.title}>
                        Home &gt; Tokens &gt; {item?.contract_ticker_symbol}
                    </div>
                    <div className={styles.title}>
                        <Link href='/Tokens'>
                            <a>← Back to Tokens</a>
                        </Link>
                    </div>
                </div>

                <div className={styles.tokenExplorerHeader}>
                    <div className={styles.tokenExplorerHeaderLeft}>
                        <div>{item?.contract_name}&nbsp;({item?.contract_ticker_symbol})</div>
                        <div>{item?.quote_rate ? formatter.format(item?.quote_rate) : 0}</div>
                    </div>
                    <div className={styles.tokenExplorerHeaderRight}>
                        <div>
                            <div>Contract Address:&nbsp;</div>
                            <div>({item?.contract_address?.slice(0, 10) + '.....'})
                                <svg onClick={() => { navigator.clipboard.writeText(item?.contract_address), alert('Copied!') }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bebebe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2">
                                    </rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div>Contract Decimals:&nbsp;</div>
                            <div>{item?.contract_decimals}</div>
                        </div>
                    </div>
                </div>

                <TokenExplorerBody item={item}
                    formatter={formatter}
                    tokenAddress={tokenAddress}
                />

                <TokenExplorerFooter state={state}
                    formatter={formatter}
                    tokenAddress={tokenAddress}
                />
            </main>
            <Footer />
        </>
    )
}


function TokenExplorerBody(props) {

    const item = props.item
    var formatter = props.formatter
    const tokenAddress = props.tokenAddress

    const getFormattedDate = (dateToFormat) => {
        let date = new Date(dateToFormat)
        let month = (date.getMonth() + 1).toString()
        let day = (date.getDate()).toString()
        let year = date.getFullYear()

        if (month.length < 2) {
            month = '0' + month
        }

        if (day.length < 2) {
            day = '0' + day
        }
        return [year, month, day].join('-')
    }

    const initialToDate = new Date()
    initialToDate.setDate(initialToDate.getDate())
    const formattedInitialToDate = getFormattedDate(initialToDate)

    const initialfromDate = new Date()
    initialfromDate.setDate(initialfromDate.getDate() - 6)
    const formattedInitialFromDate = getFormattedDate(initialfromDate)


    const [fromDate, setFromDate] = useState(formattedInitialFromDate)
    const [toDate, setToDate] = useState(formattedInitialToDate)
    const [pricingChartLabels, setPricingChartLabels] = useState([])
    const [pricingChartData, setPricingChartData] = useState([])
    const [pricingDataDays, setPricingDataDays] = useState('7 Days')


    const { data, isLoading, isError } = getHistoricalTokenPrices(tokenAddress, fromDate, toDate)


    useEffect(() => {
        if (data) {
            createPricingChartData()
        }
    }, [data])


    const handlePricingDaysClick = (days) => {
        const latestFromDate = ''
        const formattedLatestFromdate = ''

        if (days == '7 Days') {
            latestFromDate = new Date()
            latestFromDate.setDate(latestFromDate.getDate() - 6)
            formattedLatestFromdate = getFormattedDate(latestFromDate)
            setFromDate(formattedLatestFromdate)
            setPricingDataDays('7 Days')
        }

        else if (days == '30 Days') {
            latestFromDate = new Date()
            latestFromDate.setDate(latestFromDate.getDate() - 29)
            formattedLatestFromdate = getFormattedDate(latestFromDate)
            setFromDate(formattedLatestFromdate)
            setPricingDataDays('30 Days')
        }

    }


    const createPricingChartData = () => {
        let tmpPricingArray = []
        let tmpPricingLabels = []
        let tmpPricingData = []

        for (var i = 0; i < data?.data[0]?.prices?.length; i++) {
            tmpPricingArray.push(data.data[0].prices[i])
        }

        for (var i = 0; i < tmpPricingArray.length; i++) {
            tmpPricingLabels.push(tmpPricingArray[i].date)
        }
        setPricingChartLabels(tmpPricingLabels)

        for (var i = 0; i < tmpPricingArray.length; i++) {
            tmpPricingData.push(tmpPricingArray[i].price)
        }
        setPricingChartData(tmpPricingData)

    }


    return (
        <div className={styles.tokenExplorerBody}>
            <div className={styles.tokenExplorerBodyLeft}>
                <div className={styles.tokenExplorerBodyLeftItem}>
                    <div>Total Liquidity</div>
                    <div>{item?.total_liquidity_quote ? formatter.format(item?.total_liquidity_quote).split('.')[0] : 0}</div>
                </div>
                <div className={styles.tokenExplorerBodyLeftItem}>
                    <div>Total Volume (24h)</div>
                    <div>{item?.total_volume_24h_quote ? formatter.format(item?.total_volume_24h_quote).split('.')[0] : 0}</div>
                </div>
                <div className={styles.tokenExplorerBodyLeftItem}>
                    <div>Total Swaps (24h)</div>
                    <div>{item?.swap_count_24h}</div>
                </div>
            </div>
            <div className={styles.chart}>
                <div className={styles.chartInfo}>
                    <div>Price (USD) <p>{toDate}</p></div>
                    <button onClick={() => handlePricingDaysClick('7 Days')} className={pricingDataDays == '7 Days' ? styles.daysButtonActive : styles.daysButton}>7D</button>
                    <button onClick={() => handlePricingDaysClick('30 Days')} className={pricingDataDays == '30 Days' ? styles.daysButtonActive : styles.daysButton}>30D</button>
                </div>
                <Line
                    data={{
                        labels: pricingChartLabels,
                        datasets: [{
                            label: `Price Trend`,
                            data: pricingChartData,
                            fill: false,
                            borderColor: '#EEEEEE',
                            backgroundColor: '#393E46',
                            borderWidth: 2,
                            tension: 0.1
                        }]
                    }}
                    height={350}
                    width={850}
                    options={{
                        maintainAspectRatio: true,
                        responsive: true
                    }} />
            </div>
        </div>

    )

}



function TokenExplorerFooter(props) {

    var formatter = props.formatter
    const tokenAddress = props.tokenAddress
    const state = props.state


    const [pageNumber, setPageNumber] = useState(0)
    const [desktop, setDesktop] = useState(globalThis.innerWidth > 600)

    const { transactionsData, isTransactionsLoading, isTransactionsError } = getTokenTransactions(state, tokenAddress, pageNumber)


    const updateMedia = () => {
        setDesktop(window.innerWidth > 600)
    }

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    })


    const chooseRender = () => {

        if (isTransactionsLoading) {
            return (
                <div className={styles.skeleton}>
                    <Loader />
                </div>
            )
        }

        else if (isTransactionsError) {
            return (
                <FailToLoad />
            )
        }

        else {

            return (
                <div className={styles.tokenExplorerFooter}>

                    <table className={styles.table}>

                        <thead>
                            <tr className={styles.tableHead}>
                                <th>#</th>
                                <th>Transaction</th>
                                <th>Total Value (USD)</th>
                                {
                                    desktop &&
                                    <th>Amount 1</th>
                                }
                                {
                                    desktop &&
                                    <th>Amount 2</th>
                                }
                                <th>Txn Hash</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                transactionsData?.data?.items?.map((item, index) => (
                                    <tr className={styles.tableRow} key={index}>
                                        <td>{10 * pageNumber + index + 1}</td>
                                        <td className={styles.tokenExplorerTableTransaction}>{item.act.replace('_LIQUIDITY', '')}&nbsp;{item.token_0.contract_ticker_symbol}&nbsp;{item.act == 'SWAP' ? 'for' : 'and'}&nbsp;{item.token_1.contract_ticker_symbol}</td>
                                        <td>{item.total_quote ? formatter.format(item.total_quote) : 0}</td>
                                        {
                                            desktop &&
                                            <td>
                                                {
                                                    item.amount_0 > "0" || null ?
                                                        formatter.format(item.amount_0).split('.')[0].replace('$', '') :
                                                        item.amount_0_in > "0" || null ?
                                                            formatter.format(item.amount_0_in).split('.')[0].replace('$', '') :
                                                            formatter.format(item.amount_0_out).split('.')[0].replace('$', '')
                                                }
                                            </td>
                                        }
                                        {
                                            desktop &&
                                            <td>
                                                {
                                                    item.amount_1 > "0" || null ?
                                                        formatter.format(item.amount_1).split('.')[0].replace('$', '') :
                                                        item.amount_1_in > "0" || null ?
                                                            formatter.format(item.amount_1_in).split('.')[0].replace('$', '') :
                                                            formatter.format(item.amount_1_out).split('.')[0].replace('$', '')
                                                }
                                            </td>
                                        }
                                        <Link href={{ pathname: `https://etherscan.io/tx/${item.tx_hash}` }}>
                                            <a target="_blank" rel="noopener noreferrer"><td className={styles.tokenExplorerTableLink}>{item.tx_hash.slice(0, desktop ? 10 : 3)}...</td></a>
                                        </Link>
                                    </tr>
                                ))
                            }
                        </tbody>

                        <tfoot className={styles.tableFoot}>
                            <tr>
                                <Pagination pageNumber={pageNumber}
                                    data={transactionsData}
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
        <div style={{ marginTop: '2rem' }}>
            <div className={styles.title}>Transactions</div>
            {chooseRender()}
        </div>
    )

}