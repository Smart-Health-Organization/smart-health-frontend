import { useEffect } from 'react';
import styles from '../styles/SnackBar.module.css'

export default function SnackBar(props) {

    useEffect(() => {

        let snackbar = document.querySelector("#snackbar");
        
        snackbar.classList.remove(styles.snackbarFadeOut);

        setTimeout(() => {
            snackbar.classList.add(styles.snackbarFadeOut);
        }, 3000);
    });

    if (props.info) {
        return (
            <div id="snackbar" className={styles.snackbar}>
                <p>{props.icon} {props.message}</p>
            </div>
        )
    }
    if (props.warning) {
        return (
            <div id="snackbar" className={styles.snackbarWarning}>
                <p>{props.icon} {props.message}</p>
            </div>
        )
    }
    if (props.success) {
        return (
            <div id="snackbar" className={styles.snackbarSuccess}>
                <p>{props.icon} {props.message}</p>
            </div>
        )
    }

}