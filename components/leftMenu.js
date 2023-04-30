import styles from '@/styles/LeftMenu.module.css'
import { faCircleUser, faIdCard } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';

let firstRender = true;

const pages = [
    { name: "Página Inicial", path: "/", icon: faCircleUser },
    { name: "Meu perfil", path: "/profile", icon: faIdCard }];


export default function LeftMenu() {

    useEffect(() => {

        if (firstRender) {
            let linkElements = [];
            const menuList = ReactDOMClient.createRoot(document.getElementById("leftMenuList"));

            linkElements.push(<Image key={9999} alt={"logo"} src={'/favicon.png'} width={41.5} height={39}></Image>)

            for (let i = 0; i < pages.length; i++) {
                let link = <Link key={i} href={pages[i].path}>
                        <FontAwesomeIcon key={i+1000} data-actualpage={window.location.pathname == pages[i].path} icon={pages[i].icon} />
                        <span key={i+2000} className={styles.descriptionItemMenu}> {pages[i].name}</span>
                    </Link>;
                linkElements.push(link);
            }

            let exit = <Link href={"/exit"} key={pages.length}>
                    <FontAwesomeIcon key={pages.length+1000} data-actualpage={"false"} icon={faRightFromBracket} />
                    <span key={pages.length+2000} className={styles.descriptionItemMenu}> Sair</span>
                </Link>;

            linkElements.push(exit);

            menuList.render(linkElements);

            firstRender = false;
        }

    });

    return (
        <div id='leftMenuList' className={styles.leftMenu}>
        </div>
    );
}