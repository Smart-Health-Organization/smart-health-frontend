import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/AddExam.module.css'
import DateComponent from '@/components/date'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBar'
import Loading from '@/components/loading'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'

let first = true;

export default function AddExam() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (first) {
            tryLogin(setIsLoading, axios, false);
            first = false;
        }
    });

    return (
        <>
            <Head>
                <title>Smart Health - Cadastrar Exame</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Meu perfil" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Meu perfil" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <LeftMenu></LeftMenu>

                <div className='main authPage'>

                    <header className='topbar'>
                        <h1 className='title displayMobile'>Smart Health</h1>
                        <MobileMenu></MobileMenu>
                        <DateComponent date={Date.now()}></DateComponent>
                    </header>

                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.addexam}>

                        </div>
                    </main>

                    <footer className='invisibleFooter'>
                    </footer>
                </div>
            </div>
        </>
    )
}