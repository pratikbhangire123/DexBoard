import React, { useState, useEffect } from 'react'

const initialState = 'uniswap_v2'
const inititalPageState = {
    pageName: 'Overview',
}


export const Context = React.createContext()
export const pageContext = React.createContext()


export const AppReducer = (state, action) => {
    switch (action.type){
       case "change_page": {
          return {
             ...state,
             pageName: action.value + state.pageName,
            }
        }
    }
}


const DexState = ({children}) => {
    const [state, setState] = useState(initialState)

    return (
        <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    )
}

export default DexState;

export const PageState = ({children}) => {
    const [pageState, setPageState] = useState(inititalPageState)


    useEffect(() => {
        const selectedPage = window.localStorage.getItem('PageState')
        if (selectedPage !== null) {
            setPageState(selectedPage)
        }
    }, [])


    useEffect(() => {
        if (pageState !== inititalPageState) {
            window.localStorage.setItem('PageState', pageState)
        }
    }, [pageState])


    return (
        <pageContext.Provider value={[pageState, setPageState]}>{children}</pageContext.Provider>
    )
}