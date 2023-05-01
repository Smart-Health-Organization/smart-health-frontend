
import styles from '../styles/Loading.module.css'

export default function Loading(props) {
    if (!props.on) return <></>;

    return <div className={styles.loadingBar}></div>;
}