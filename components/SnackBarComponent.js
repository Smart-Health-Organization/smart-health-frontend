import { useEffect, useState } from 'react';
import styles from '../styles/SnackBar.module.css';

const options = { "info": styles.snackbar, "warning": styles.snackbarWarning, "success": styles.snackbarSuccess };
let fadingOut;

export default function SnackBar(props) {
    const [style, setStyle] = useState([options[props.option]]);

    useEffect(() => setStyle([options[props.option]]), [props]);

    if (!props.message) return;

    if (!props.message.length) return;

    if (fadingOut) clearTimeout(fadingOut);
    fadingOut = setTimeout(() => setStyle([options[props.option], styles.snackbarFadeOut]), 5000);

    return (
        <div className={style.join(" ")}>
            <ul>
                {props.message}
            </ul>
        </div>
    );
}