import { useEffect } from 'react';
import styles from '../styles/SnackBar.module.css'

export default function SnackBar(props) {

    const options = { "info": styles.snackbar, "warning": styles.snackbarWarning, "success": styles.snackbarSuccess };

    useEffect(() => {
        if (!props.message) return;

        let snackbar = document.querySelector("#snackbar");

        snackbar.classList.remove(styles.snackbarFadeOut);
        snackbar.classList.remove(styles.hiddenSnackbar);
        snackbar.classList.add(options[props.option]);

        setTimeout(() => {
            snackbar.classList.add(styles.snackbarFadeOut);
        }, 3000);
    });

    return (
        <div id="snackbar" className={styles.hiddenSnackbar}>
            <p>{props.icon} {props.message}</p>
        </div>
    )
}