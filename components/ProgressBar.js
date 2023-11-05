import styles from '../styles/ProgressBar.module.css'

export default function ProgressBar(props = { color: "#000", progress: 70 }) {

    return <div className={styles.progressBar}><div style={{backgroundColor: props.color, width: props.progress + '%'}}></div></div>
}