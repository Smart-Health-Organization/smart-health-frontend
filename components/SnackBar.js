import { useEffect } from 'react';
import styles from '../styles/SnackBar.module.css'

export default function SnackBar(props) {

    const options = { "info": styles.snackbar, "warning": styles.snackbarWarning, "success": styles.snackbarSuccess };

    useEffect(() => {
        if (!props.message) return;

        if (!props.message.length) return;

        let snackbar = document.querySelector("#snackbar");

        snackbar.classList = "";
        snackbar.classList.add(options[props.option]);

        setTimeout(() => {
            snackbar.classList.add(styles.snackbarFadeOut);
        }, 5000);
    });

    return (
        <div id="snackbar" className={styles.hiddenSnackbar}>
            <ul>
                {props.message}
            </ul>
        </div>
    )
}