import styles from '@/styles/LeftMenu.module.css'
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faFileCirclePlus, faHospitalUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const pages = [
    { name: "Ver Exames", path: "/ver-exames", icon: faHospitalUser },
    { name: "Cadastrar Exame", path: "/adicionar-exames", icon: faFileCirclePlus },
    { name: "Meu Perfil", path: "/perfil", icon: faIdCard },
    { name: "Sair", path: "/sair", icon: faRightFromBracket }];

export default function LeftMenu(props = { actualpage: "/" }) {
    let links = [];

    links.push(<a href={"/"} key={0}><img alt={"logo"} src={'/favicon.png'} width={41.5} height={39} style={{ width: 'auto' }} /><span className={styles.descriptionItemMenuLogo}> Smart Health</span></a>)

    for (let i = 0; i < pages.length; i++) {
        links.push(<a key={i + 1} href={pages[i].path}>
            <FontAwesomeIcon data-actualpage={props.actualpage === pages[i].path} icon={pages[i].icon} />
            <span className={styles.descriptionItemMenu}> {pages[i].name}</span>
        </a>);
    }

    return (
        <div id='leftMenuList' className={styles.leftMenu}>
            {links}
        </div>
    );
}