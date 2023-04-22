import styles from '@/styles/MobileMenu.module.css'
import { faCircleUser, faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';

let firstRender = true;

const pages = [
    { name: "Página Inicial", path: "/", icon: <FontAwesomeIcon icon={faCircleUser} /> },
    { name: "Meu perfil", path: "/profile", icon: <FontAwesomeIcon icon={faIdCard} /> }];


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

        if (firstRender) {
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

            let exit = <Link href={"/exit"} key={pages.length}><FontAwesomeIcon data-actualpage={"false"} icon={faRightFromBracket} /> Sair</Link>

            linkElements.push(exit);

            menuList.render(linkElements);

            firstRender = false;
        }

    });

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