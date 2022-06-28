import styles from "../styles/Home.module.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Context } from "../components/DexState"
import { getChartData, getDEXHealth } from "../data"
import { useEffect, useState, useContext } from "react"
import Chart from 'chart.js/auto';
import { Bar, Line } from "react-chartjs-2"
import Loader from "../components/Loader"
import FailToLoad from "../components/FailToLoad"


export default function DexBoardApp() {

    const [state, setState] = useContext(Context)

    const { data, isLoading, isError } = getDEXHealth(state);
    const { chartData, isChartLoading, isChartError } = getChartData(state);


    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
    });


    const chooseRender = () => {

        if (isLoading) {
            return (
                <Loader />
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

                    <div className={styles.title}>Overview</div>

                    <div>
                        {
                            data?.data?.items?.map((item, index) => (
                                <div className={styles.healthSection} key={index}>
                                    <div className={styles.healthItem}>
                                        <div>Synced Block Height:&nbsp;&nbsp;</div>
                                        <div>{item.synced_block_height.toLocaleString()}&nbsp;&nbsp;{item.synced_block_signed_at.replace("T", " ").replace("Z", "").split('.')[0]}</div>
                                    </div>
                                    <div className={styles.healthItem}>
                                        <div>Latest Block Height:&nbsp;&nbsp;</div>
                                        <div>{item.latest_block_height.toLocaleString()}&nbsp;&nbsp;{item.latest_block_signed_at.replace("T", " ").replace("Z", "")}</div>
                                    </div>
                                </div>

                            ))
                        }
                    </div>

                    <ChartComponent state={state} />

                    <OtherData chartData={chartData}
                        formatter={formatter}
                    />
                </div>
            )
        }
    }

    return (

        <>
            <Navbar />
            <main className={styles.main}>
                {chooseRender()}
            </main>
            <Footer />
        </>

    )

}



function ChartComponent(props) {

    const [volumeLabels, setVolumeLabels] = useState([])
    const [volumeQuoteData, setVolumeQuoteData] = useState([])
    const [volumeDataDays, setVolumeDataDays] = useState('7 Days')
    const [liquidityLabels, setLiquidityLabels] = useState([])
    const [liquidityQuoteData, setLiquidityQuoteData] = useState([])
    const [liquidityDataDays, setLiquidityDataDays] = useState('7 Days')
    const state = props.state

    const { chartData, isChartLoading, isChartError } = getChartData(state);


    useEffect(() => {
        if (chartData) {
            createVolumeChartData()
        }

    }, [chartData, volumeDataDays])

    useEffect(() => {
        if (chartData) {
            createLiquidityChartData()
        }

    }, [chartData, liquidityDataDays])


    const handleVolumeDaysClick = (days) => {
        if (days == '7 Days') {
            setVolumeDataDays(days)
        }

        else if (days == '30 Days') {
            setVolumeDataDays(days)
        }

    }

    const handleLiquidityDaysClick = (days) => {
        if (days == '7 Days') {
            setLiquidityDataDays(days)
        }

        else if (days == '30 Days') {
            setLiquidityDataDays(days)
        }
    }


    const createVolumeChartData = () => {
        let tmpVolumeArray = []
        let tmpVolumeLabels = []
        let tmpVolumeQuote = []

        if (volumeDataDays == '7 Days') {
            for (var i = 0; i < chartData.data.items.length; i++) {
                tmpVolumeArray.push(chartData.data.items[i].volume_chart_7d)
            }
        }

        else if (volumeDataDays == '30 Days') {
            for (var i = 0; i < chartData.data.items.length; i++) {
                tmpVolumeArray.push(chartData.data.items[i].volume_chart_30d)
            }
        }

        for (var i = 0; i < tmpVolumeArray[0].length; i++) {
            tmpVolumeLabels.push(tmpVolumeArray[0][i].dt.replace("T00:00:00Z", " "))
        }
        setVolumeLabels(tmpVolumeLabels)

        for (var i = 0; i < tmpVolumeArray[0].length; i++) {
            tmpVolumeQuote.push(tmpVolumeArray[0][i].volume_quote)
        }
        setVolumeQuoteData(tmpVolumeQuote)

        console.log(volumeQuoteData)
    }


    const createLiquidityChartData = () => {
        let tmpLiquidityArray = []
        let tmpLiquidityLabels = []
        let tmpLiquidityQuote = []

        if (liquidityDataDays == '7 Days') {
            for (var i = 0; i < chartData.data.items.length; i++) {
                tmpLiquidityArray.push(chartData.data.items[i].liquidity_chart_7d)
            }
        }

        else if (liquidityDataDays == '30 Days') {
            for (var i = 0; i < chartData.data.items.length; i++) {
                tmpLiquidityArray.push(chartData.data.items[i].liquidity_chart_30d)
            }
        }

        for (var i = 0; i < tmpLiquidityArray[0].length; i++) {
            tmpLiquidityLabels.push(tmpLiquidityArray[0][i].dt.replace("T00:00:00Z", " "))
        }
        setLiquidityLabels(tmpLiquidityLabels)

        for (var i = 0; i < tmpLiquidityArray[0].length; i++) {
            tmpLiquidityQuote.push(tmpLiquidityArray[0][i].liquidity_quote)
        }
        setLiquidityQuoteData(tmpLiquidityQuote)

        console.log(liquidityQuoteData)
    }


    return (
        <div className={styles.chartSection}>
            <div className={styles.chart}>
                <div className={styles.chartInfo}>
                    <div>Liquidity</div>
                    <button onClick={() => handleLiquidityDaysClick('7 Days')} className={liquidityDataDays == '7 Days' ? styles.daysButtonActive : styles.daysButton}>7D</button>
                    <button onClick={() => handleLiquidityDaysClick('30 Days')} className={liquidityDataDays == '30 Days' ? styles.daysButtonActive : styles.daysButton}>30D</button>
                </div>

                <Line
                    data={{
                        labels: liquidityLabels,
                        datasets: [{
                            label: `${liquidityDataDays} Liquidity Trend`,
                            data: liquidityQuoteData,
                            fill: true,
                            borderColor: '#393E46',
                            backgroundColor: '#fefefe',
                            borderWidth: 2,
                            tension: 0.1
                        }]
                    }}
                    height={200}
                    width={500}
                    options={{
                        maintainAspectRatio: true,
                        responsive: true
                    }}
                />
            </div>
            <div className={styles.chart}>
                <div className={styles.chartInfo}>
                    <div>Volume</div>
                    <button onClick={() => handleVolumeDaysClick('7 Days')} className={volumeDataDays == '7 Days' ? styles.daysButtonActive : styles.daysButton}>7D</button>
                    <button onClick={() => handleVolumeDaysClick('30 Days')} className={volumeDataDays == '30 Days' ? styles.daysButtonActive : styles.daysButton}>30D</button>
                </div>
                <Bar
                    data={{
                        labels: volumeLabels,
                        datasets: [{
                            label: `${volumeDataDays} Volume`,
                            data: volumeQuoteData,
                            borderColor: '#393E46',
                            borderWidth: 2,
                            backgroundColor: '#fefefe',
                        }]
                    }}
                    height={200}
                    width={500}
                    options={{
                        maintainAspectRatio: true,
                        responsive: true
                    }}
                />
            </div>

        </div>
    )
}



function OtherData(props) {

    const chartData = props.chartData
    var formatter = props.formatter


    return (
        <div className={styles.otherDataSection}>
            <div className={styles.otherData}>
                <div className={styles.otherDataTitle}>Total Swaps (24h)</div>
                {
                    chartData?.data?.items?.map((item, index) => (
                        <div className={styles.otherDataValue} key={index}>{item.total_swaps_24h.toLocaleString()}</div>
                    ))
                }
            </div>

            <div className={styles.otherData}>
                <div className={styles.otherDataTitle}>Total Active Pairs (7D)</div>
                {
                    chartData?.data?.items?.map((item, index) => (
                        <div className={styles.otherDataValue} key={index}>{item.total_active_pairs_7d.toLocaleString()}</div>
                    ))
                }
            </div>

            <div className={styles.otherData}>
                <div className={styles.otherDataTitle}>Total Fees (24h)</div>
                {
                    chartData?.data?.items?.map((item, index) => (
                        <div className={styles.otherDataValue} key={index}>{item.total_fees_24h ? formatter.format(item.total_fees_24h).split('.')[0] : 0}</div>
                    ))
                }
            </div>
        </div>
    )
}
