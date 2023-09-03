import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/AddMeta.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import TopBar from '@/components/TopBar'
import { getMeta } from './dashboard'
import Link from 'next/link'

export default function AddMeta() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [titulo, setTitulo] = useState('');
    const [data, setData] = useState(new Date(Date.now()).toISOString());
    const [mmagra, setMmagra] = useState(0);
    const [gcorporal, setGcorporal] = useState(0);

    const [meta, setMeta] = useState({});

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);

        getMeta(setIsLoading).then((response) => setMeta(response));
    }, []);

    useEffect(() => {
        setErrorMessages([]);
    }, [titulo, data, mmagra, gcorporal]);

    useEffect(() => {
        if (document && document.querySelector('#titulo'))
            document.querySelector('#titulo').focus();
    }, [meta]);

    function onEnter(e) {
        if (e.key !== 'Enter') return;

        if (e.target.id === 'gcorporal') {
            postMeta();
            return;
        }

        e.target.parentElement.nextSibling.focus();
    }

    async function postMeta() {
        setIsLoading(true);

        const requestData = {
            titulo,
            dataInicio: new Date(Date.now() + 300000).toISOString(),
            dataFim: data + "T00:00:00.000Z",
            massaMagra: mmagra,
            gorduraCorporal: gcorporal,
        };

        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/metas', requestData, { headers: { Authorization: sessionStorage.getItem("token") } });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Meta criada com sucesso!</li>]);
            setTimeout(() => window.location.href = '/acompanhar-meta', 1000);
        }
        catch (error) {
            setTypeOfMessage('warning');
            if (error.response)
                if (!error.response.data.message.map) {
                    setErrorMessages([<li key={0}>{error.response.data.message}</li>]);
                }
                else {
                    setErrorMessages(error.response.data.message.map((message, index) => {
                        return <li key={index}>{message}</li>
                    }));
                }
        }
        finally {
            setIsLoading(false);
        }
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

                <LeftMenu actualpage='/acompanhar-meta'></LeftMenu>

                <div className='main authPage'>

                    <TopBar actualpage='/acompanhar-meta'></TopBar>

                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.addexam}>
                            <h2 className='subtitle'>Adicionar Meta</h2>
                            {isLoading ? <></> :
                                meta ?
                                    <>
                                        <div className={styles.form}>
                                            <h3>Você já tem uma Meta em andamento!</h3>
                                        </div>
                                        <Link href='/acompanhar-meta' className='ajuda'>Acompanhar Meta</Link>
                                    </>
                                    :
                                    <>
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
                                    </>
                            }
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}
