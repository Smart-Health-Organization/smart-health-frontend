import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/AllMetas.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import TopBar from '@/components/TopBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'

export default function AllMetas() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [metas, setMetas] = useState([]);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);

        getAllMeta(setIsLoading).then((response) => {
            let todasMetas = []

            response.map(meta => {
                todasMetas.push(
                    <div key={meta.id} className={styles.meta}>
                        <div className={styles.left}>
                            <h3>{meta.titulo}</h3>
                            <p><FontAwesomeIcon icon={faCalendar} /> Data Inicial: {(new Date(meta.dataInicio)).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                            <p><FontAwesomeIcon icon={faCalendar} /> Data Final: {(new Date(meta.dataFim)).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                        </div>
                        <div className={styles.right}>
                            <h3>{meta.isConcluida ? <><FontAwesomeIcon icon={faCheck} /> Concluída</> : <><FontAwesomeIcon icon={faX} /> Não Concluída</>}</h3>
                            <button onClick={() => deleteMeta(meta.id)} className='ajuda delete'> Deletar</button>
                        </div>
                    </div>
                )
            });

            setMetas(todasMetas);
        });
    }, []);

    async function deleteMeta(id) {
        if (!confirm('Tem certeza que deseja deletar essa meta?')) return;

        setIsLoading(true);

        try {
            await axios.delete(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/metas/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }
            });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Meta deletada com sucesso!</li>]);
            setTimeout(() => window.location.href = '/todas-metas', 1000);
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
                <title>Smart Health - Todas as Metas</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Todas as Metas" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Todas as Metas" />
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
                            <h2 className='subtitle'>Todas as Metas</h2>
                            {metas}
                        </div>
                    </main>

                </div >
            </div >
        </>
    )
}

export async function getAllMeta(setIsLoading) {
    setIsLoading(true);

    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/metas', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('token')
        }
    });

    setIsLoading(false);
    return response.data;
}
