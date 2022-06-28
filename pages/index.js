import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Logo from '../public/DexBoard-WB.png'
import Link from 'next/link'
import Image from 'next/image'


export default function Home() {

  return (
    <div>

      <Head>
        <title>DexBoard</title>
        <meta name="description" content="The dashboard to assemble interesting data points and stats from multiple DEXes in a single tool." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.home}>
          <div><Image src={Logo} /></div>
          <h1>Welcome to DexBoard!</h1>
          <p>Get the interesting stats & analytics of multiple DEXes in a single window. </p>
          <Link href='/Overview'>
            <button>Launch Tool</button>
          </Link>
        </div>

      </main>

    </div>
  )
}
