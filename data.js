import useSWR from "swr";
import { APIKEY, baseURL } from "./config";

const fetcher = (...args) => fetch(...args).then(res => res.json())


export function getDEXHealth(state) {

    const url = `${baseURL}/1/xy=k/${state}/health/?quote-currency=USD&format=JSON&key=${APIKEY}`;

    const { data, error } = useSWR(url, fetcher)

    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
    
}

export function getChartData(state) {

    const url = `${baseURL}/1/xy=k/${state}/ecosystem/?quote-currency=USD&format=JSON&key=${APIKEY}`;
    
    const { data, error } = useSWR(url, fetcher)

    return {
        chartData: data,
        isChartLoading: !error && !data,
        isChartError: error
    }

}

export function getDEXPools(state, pageNumber) {

    const url = `${baseURL}/1/xy=k/${state}/pools/?quote-currency=USD&format=JSON&page-number=${pageNumber}&page-size=10&key=${APIKEY}`;

    const { data, error } = useSWR(url, fetcher)

    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}

export function getDEXTokens(state, pageNumber) {

    const url = `${baseURL}/1/xy=k/${state}/tokens/?quote-currency=USD&format=JSON&page-number=${pageNumber}&page-size=10&key=${APIKEY}`

    const { data, error } = useSWR(url, fetcher)

    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}

export function getHistoricalTokenPrices(tokenAddress, fromDate, toDate) {

    const url = `${baseURL}/pricing/historical_by_addresses_v2/1/USD/${tokenAddress}/?quote-currency=USD&format=JSON&from=${fromDate}&to=${toDate}&prices-at-asc=true&key=${APIKEY}`

    const {data, error} = useSWR(url, fetcher)

    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }

}

export function getTokenTransactions(state, tokenAddress, pageNumber) {

    const url = `${baseURL}/1/xy=k/${state}/tokens/address/${tokenAddress}/transactions/?quote-currency=USD&format=JSON&page-number=${pageNumber}&page-size=10&key=${APIKEY}`

    const {data, error} = useSWR(url, fetcher)

    return {
        transactionsData: data,
        isTransactionsLoading: !error && !data,
        isTransactionsError: error
    }

}

