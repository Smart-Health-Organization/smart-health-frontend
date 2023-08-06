import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MobileMenuItem(props = {path: "/", name: "Home", icon: null, actualpage: "/"}) {
    return (<Link href={props.path} data-actualpage={props.actualpage == props.path}>{props.icon || <FontAwesomeIcon icon={faHome} />} {props.name}</Link>);
}