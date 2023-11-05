import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/LeftMenu.module.css";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function LeftMenuItem(props = {path: "/", name: "Home", icon: null, actualpage: "/"}) {
    return (<Link href={props.path}>
        <FontAwesomeIcon data-actualpage={props.actualpage === props.path} icon={props.icon || faHome} />
        <span className={styles.descriptionItemMenu}> {props.name}</span>
    </Link>);
}