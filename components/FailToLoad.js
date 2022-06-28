import styles from '../styles/Home.module.css'

export default function FailToLoad() {

    return (
        <div className={styles.failToLoad}>
            <div></div>
            <h3>Aw, Snap!😣 </h3>
            <p>Failed to load a page!</p>
        </div>
    )

}
