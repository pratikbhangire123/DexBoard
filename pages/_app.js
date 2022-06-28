import DexState, { PageState } from '../components/DexState'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  
  return (
      <DexState>
        <PageState>
          <Component {...pageProps} />
        </PageState>
      </DexState>  
  )
}

export default MyApp
