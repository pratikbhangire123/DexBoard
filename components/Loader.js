import styles from '../styles/Home.module.css'

export default function Loader() {
    return (
        <div className={styles.loaderCenter}>
            <div className={styles.loader}></div>
            <div className={styles.loader}></div>
            <div className={styles.loader}></div>
        </div>
    )
}