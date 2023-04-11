import styles from '@/styles/LeftMenu.module.css'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect } from 'react';

let firstRender = true;

export default function LeftMenu(props) {

    function openMenu() {
        document.getElementById("menu").style.width = "300px";
        document.getElementById("menu").style.height = "auto";
        document.getElementById("menu").style.minHeight =  (45+40*1) + "px";
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
                console.log(e.target.parentNode.id);
                if (e.target.id != "menu" && e.target.id != "openMenu" && e.target.parentNode.id != "openMenu" && e.target.parentNode.parentNode.id != "openMenu") {
                    closeMenu();
                }
            });
            firstRender = false;
        }

    });

    if (props.isMobile) {
        return (
            <div className={styles.divMenuMobile}>
                <a id="openMenu" className={styles.mobileMenu} onClick={openMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </a>
                <div id="menu" className={styles.menu}>
                    <div id="menuList" className={styles.menuList}>
                        <Link href={"/"}><FontAwesomeIcon icon={faCircleUser} /> Página Inicial</Link>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={styles.leftMenu}>

            </div>
        );
    }
}