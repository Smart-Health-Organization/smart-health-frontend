import styles from '@/styles/MobileMenu.module.css'
import { faCircleUser, faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faBars, faChartPie, faFileCirclePlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';

const pages = [
    { name: "Página Inicial", path: "/", icon: <FontAwesomeIcon key={1000} icon={faCircleUser} /> },
    { name: "Ver Exames", path: "/exams", icon: <FontAwesomeIcon key={1001} icon={faChartPie} /> },
    { name: "Cadastrar Exame", path: "/addexam", icon: <FontAwesomeIcon key={1001} icon={faFileCirclePlus} /> },
    { name: "Meu Perfil", path: "/profile", icon: <FontAwesomeIcon key={1001} icon={faIdCard} /> }];


export default function MobileMenu() {

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

        let linkElements = [];
        const menuList = ReactDOMClient.createRoot(document.getElementById("menuList"));

        for (let i = 0; i < pages.length; i++) {
            let link = <Link key={i} href={pages[i].path} data-actualpage={window.location.pathname == pages[i].path}>{pages[i].icon} {pages[i].name}</Link>;
            linkElements.push(link);
        }

        let exit = <Link href={"/exit"} key={pages.length}><FontAwesomeIcon key={pages.length + 1000} data-actualpage={"false"} icon={faRightFromBracket} /> Sair</Link>

        linkElements.push(exit);

        menuList.render(linkElements);
    }, []);

    return (
        <div className={styles.divMenuMobile}>
            <a id="openMenu" className={styles.mobileMenu} onClick={openMenu}>
                <FontAwesomeIcon icon={faBars} />
            </a>
            <div id="menu" className={styles.menu}>
                <div id="menuList" className={styles.menuList}>
                </div>
            </div>
        </div>
    );
}