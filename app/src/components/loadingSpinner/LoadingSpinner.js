import styles from './loadingSpinner.module.css'

export const LoadingSpinner = () => {
    return (
        <div className={styles.contForSpinner}>
            <div className={styles.loaderSpinner}></div>
        </div>
    )
}