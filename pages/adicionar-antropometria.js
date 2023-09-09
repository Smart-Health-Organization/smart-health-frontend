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
import onEnter from '@/functions/onEnter'

export default function AddAntropometrias() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [altura, setAltura] = useState(0);
    const [peso, setPeso] = useState(0);
    const [atividadeFisicaSemanal, setAtividadeFisicaSemanal] = useState(0);
    const [coxa, setCoxa] = useState(0);
    const [abdominal, setAbdominal] = useState(0);
    const [triceps, setTriceps] = useState(0);
    const [suprailiaca, setSuprailiaca] = useState(0);

    const [meta, setMeta] = useState({});

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);

        getMeta(setIsLoading).then((response) => setMeta(response));
    }, []);

    useEffect(() => {
        setErrorMessages([]);
    }, [altura, peso, atividadeFisicaSemanal, coxa, abdominal, triceps, suprailiaca]);

    useEffect(() => {
        if (document && document.querySelector('#altura'))
            document.querySelector('#altura').focus();
    }, [meta]);

    async function postAntropometria() {
        setIsLoading(true);

        const requestData = {
            altura,
            peso,
            atividadeFisicaSemanal,
            data: new Date(Date.now()).toISOString(),
            coxa,
            abdominal,
            triceps,
            suprailiaca,
        };

        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/metas/' + meta.id + '/antropometrias', requestData, { headers: { Authorization: sessionStorage.getItem("token") } });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Antropometria adicionada com sucesso!</li>]);
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
                <title>Smart Health - Adicionar Antropometria</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Adicionar Antropometria" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Adicionar Antropometria" />
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
                            <h2 className='subtitle'>Adicionar Antropometria</h2>
                            {isLoading ? <></> :
                                meta ?
                                    <>
                                        <div className={styles.form}>
                                            <label>
                                                Altura: <input id="altura" type="number" min={0} placeholder='Digite a altura em cm' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setAltura(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Peso: <input id="peso" type="number" min={0} placeholder='Digite o peso em Kg' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setPeso(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Atividade Física Semanal: <input id="atividadeFisicaSemanal" type="number" min={0} max={7} placeholder='Em dias' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setAtividadeFisicaSemanal(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Coxa: <input id="coxa" type="number" min={0} placeholder='Digite em cm' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setCoxa(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Abdominal: <input id="abdominal" min={0} type="number" placeholder='Digite em cm' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setAbdominal(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Tríceps: <input id="triceps" type="number" min={0} placeholder='Digite em cm' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setTriceps(Number(e.target.value))}></input>
                                            </label>
                                            <label>
                                                Suprailíaca: <input id="suprailiaca" type="number" min={0} placeholder='Digite em cm' onKeyDown={e => onEnter(e, postAntropometria)} onChange={(e) => setSuprailiaca(Number(e.target.value))}></input>
                                            </label>
                                        </div>
                                        <button onClick={postAntropometria} className='ajuda'>Adicionar Antropometria</button>
                                    </>
                                    :
                                    <>
                                        <div className={styles.form}>
                                            <h3>Você precisa criar uma Meta primeiro!</h3>
                                        </div>
                                        <Link href='/adicionar-meta' className='ajuda'>Criar Meta</Link>
                                    </>
                            }
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}
