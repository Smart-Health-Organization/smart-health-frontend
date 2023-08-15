import LeftMenu from "@/components/LeftMenuComponent";
import TopBar from "@/components/TopBar";
import Head from "next/head";
import styles from '@/styles/Dashboard.module.css';
import { useEffect, useState } from "react";
import Loading from "@/components/LoadingComponent";
import SnackBar from "@/components/SnackBarComponent";
import tryLogin from "@/functions/tryLogin";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [userName, setUserName] = useState('Usuário');
    const [saudacao, setSaudacao] = useState('Olá');

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        setIsLoading(true);

        if (new Date().getHours() >= 6 && new Date().getHours() < 12) setSaudacao('Bom dia');
        else if (new Date().getHours() >= 12 && new Date().getHours() < 18) setSaudacao('Boa tarde');
        else if (new Date().getHours() >= 18 || new Date().getHours() < 6) setSaudacao('Boa noite');

        fetch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            }
        }).then(async (response) => setUserName((await response.json()).nome.split(' ')[0])).finally(() => setIsLoading(false));
    }, []);

    return (
        <>
            <Head>
                <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <LeftMenu actualpage="/dashboard" ></LeftMenu>

                <div className='main authPage dashboard'>

                    <main className='content'>
                        <TopBar actualpage="/dashboard"></TopBar>

                        <div className={styles.content}>
                            <h1>{saudacao}, {userName}!</h1>

                            <div className={styles.callaction}>
                                <p>
                                    Bem-vindo(a) ao <strong>Smart Health</strong>, a plataforma web para armazenamento, acompanhamento e compartilhamento seguro de resultados de exames e informações de saúde.
                                </p>
                            </div>

                            <div className={styles.callaction}>
                                <p>
                                    Adicione novos exames para acompanhar sua evolução!
                                </p>
                                <Link className='ajuda' href='/adicionar-exames'>Adicionar</Link>
                            </div>
                        </div>
                    </main>

                    <aside className={styles.aside}>
                        <div className={styles.imc}>
                            <div className={styles.title}>
                                <h3>Calculadora de IMC</h3>
                            </div>
                            <div className={styles.body}>
                                <div className={styles.info}>
                                    <div className={styles.altura}>
                                        <img src="./peso_altura.png"></img>
                                        <p><span>Altura: </span><input type="number" placeholder="185 cm"></input></p>
                                    </div>
                                    <div className={styles.peso}>
                                        <img src="./peso_altura.png"></img>
                                        <p><span>Peso: </span><input type="number" placeholder="82 kg"></input></p>
                                    </div>
                                </div>
                                <div className={styles.result}>
                                    <h4>Índice de Massa Corporal (IMC)</h4>
                                    <h3>0 Kg/m²</h3>
                                    <h4 className={styles.alertGreen}>IMC Normal</h4>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={styles.antropometria}>
                            <div className={styles.title}>
                                <h3>Antropometria</h3>
                            </div>
                            <div className={styles.body}>
                                <h1>Em breve!</h1>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}