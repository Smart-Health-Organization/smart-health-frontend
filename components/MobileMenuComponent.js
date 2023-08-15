import styles from '@/styles/MobileMenu.module.css'
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faFileCirclePlus, faHospitalUser, faRightFromBracket, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import MobileMenuItem from './MobileMenuItem';

const pages = [
    { name: "Dashboard", path: "/dashboard", icon: <FontAwesomeIcon icon={faTableColumns} /> },
    { name: "Ver Exames", path: "/ver-exames", icon: <FontAwesomeIcon icon={faHospitalUser} /> },
    { name: "Carregar Exames", path: "/adicionar-exames", icon: <FontAwesomeIcon icon={faFileCirclePlus} /> },
    { name: "Meu Perfil", path: "/perfil", icon: <FontAwesomeIcon icon={faIdCard} /> },
    { name: "Sair", path: "/sair", icon: <FontAwesomeIcon icon={faRightFromBracket} /> }];


export default function MobileMenu(props = { actualpage: "/" }) {

    function openMenu() {
        document.getElementById("menu").style.width = "300px";
        document.getElementById("menu").style.height = "auto";
        document.getElementById("menu").style.minHeight = (60 + 50 * pages.length) + "px";
        document.getElementById("openMenu").style.display = "none";
        setTimeout(() => document.getElementById("menuList").style.display = "flex", 300);
    }

    function closeMenu() {
        document.getElementById("menu").style.width = "0";
        document.getElementById("menu").style.height = "0";
        document.getElementById("menu").style.minHeight = "0";
        document.getElementById("openMenu").style.display = "flex";
        document.getElementById("menuList").style.display = "none";
    }

    useEffect(() => {
        document.body.addEventListener("click", (e) => {
            if (e.target.id != "menu" && e.target.id != "openMenu" && e.target.parentNode.id != "openMenu" && e.target.parentNode.parentNode.id != "openMenu") {
                closeMenu();
            }
        });
    }, []);

    let links = [];

    for (let i = 0; i < pages.length; i++) {
        links.push(<MobileMenuItem key={i} actualpage={props.actualpage} path={pages[i].path} icon={pages[i].icon} name={pages[i].name} />);
    }

    return (
        <div className={styles.divMenuMobile}>
            <a id="openMenu" className={styles.mobileMenu} onClick={openMenu}>
                <img alt={"logo"} src={'/favicon.png'} height={30} style={{ width: 'auto' }} />
            </a>
            <div id="menu" className={styles.menu}>
                <div id="menuList" className={styles.menuList}>
                    <a href={'/'} data-actualpage={false}><img alt={"logo"} src={'/favicon.png'} height={28} style={{ width: 'auto' }} /> <strong>Smart Health</strong></a>
                    {links}
                </div>
            </div>
        </div>
    );
}