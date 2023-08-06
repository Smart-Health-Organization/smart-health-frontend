import styles from '@/styles/LeftMenu.module.css'
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faFileCirclePlus, faHospitalUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import LeftMenuItem from './LeftMenuItem';

const pages = [
    { name: "Ver Exames", path: "/ver-exames", icon: faHospitalUser },
    { name: "Cadastrar Exame", path: "/adicionar-exames", icon: faFileCirclePlus },
    { name: "Meu Perfil", path: "/perfil", icon: faIdCard },
    { name: "Sair", path: "/sair", icon: faRightFromBracket }];

export default function LeftMenu(props = { actualpage: "/" }) {
    let links = [];

    links.push(<a href={"/"} key={0}><img alt={"logo"} src={'/favicon.png'} width={41.5} height={39} style={{ width: 'auto' }} /><span className={styles.descriptionItemMenuLogo}> Smart Health</span></a>)

    for (let i = 0; i < pages.length; i++) {
        links.push(<LeftMenuItem key={i+1} actualpage={props.actualpage} icon={pages[i].icon} name={pages[i].name} path={pages[i].path} />);
    }

    return (
        <div id='leftMenuList' className={styles.leftMenu}>
            {links}
        </div>
    );
}