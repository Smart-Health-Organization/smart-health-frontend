import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/AddMeta.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import TopBar from '@/components/TopBar'

export default function AddMeta() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState(new Date(Date.now()).toISOString());
    const [mmagra, setMmagra] = useState('');
    const [gcorporal, setGcorporal] = useState('');

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        if (document)
            document.querySelector('#titulo').focus();
    }, []);

    function onEnter(e) {
        if (e.key !== 'Enter') return;

        if (e.target.id === 'gcorporal') {
            postMeta();
            return;
        }

        e.target.parentElement.nextSibling.focus();
    }

    function postMeta() {
        const requestData = {
            titulo,
            dataInicio: new Date(Date.now()).toISOString(),
            dataFim: data + "T00:00:00.000Z",
            massaMagra: mmagra,
            gorduraCorporal: gcorporal,
        };

        console.log(requestData);
    }

    return (
        <>
            <Head>
                <title>Smart Health - Adicionar Meta</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Adicionar Meta" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Adicionar Meta" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <LeftMenu actualpage='/dashboard'></LeftMenu>

                <div className='main authPage'>

                    <TopBar actualpage='/dashboard'></TopBar>

                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.addexam}>
                            <h2 className='subtitle'>Adicionar Meta</h2>
                            <div className={styles.form}>
                                <label>
                                    Título: <input id="titulo" type="text" placeholder='Digite um título' onKeyDown={onEnter} onChange={(e) => setTitulo(e.target.value)}></input>
                                </label>
                                <label>
                                    Data alvo: <input id="data" type='date' onKeyDown={onEnter} onChange={(e) => setData(e.target.value)}></input>
                                </label>
                                <label>
                                    Massa magra almejada: <input id="mmagra" type="number" placeholder='Digite a massa magra em Kg' onKeyDown={onEnter} onChange={(e) => setMmagra(e.target.value)}></input>
                                </label>
                                <label>
                                    Gordura Corporal almejado: <input id='gcorporal' type="number" placeholder='Digite a gordura corporal em percentual' onKeyDown={onEnter} onChange={(e) => setGcorporal(e.target.value)}></input>
                                </label>
                            </div>
                            <button onClick={postMeta} className='ajuda'>Criar Meta</button>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}
