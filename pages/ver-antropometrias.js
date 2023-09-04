import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/AllMetas.module.css'
import styles1 from '@/styles/Exams.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import TopBar from '@/components/TopBar'
import Link from 'next/link'

export default function Antropometrias() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [antropometrias, setAntropometrias] = useState([]);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);

        getAllAntropometrias(setIsLoading).then((response) => {
            let todasAntropometrias = [];

            response.map(data => {
                todasAntropometrias.push(
                    <div key={data.id} className={styles.meta} style={{ marginTop: '0' }}>
                        <div className={styles.left}>
                            <h3>Medição#{data.id}</h3>
                            <p><FontAwesomeIcon icon={faCalendar} /> Feito em: {(new Date(data.data)).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                        </div>
                        <div className={styles.right} style={{ justifyContent: 'center' }}>
                            <button onClick={() => deleteAntropometria(data.id)} className='ajuda delete'> Remover</button>
                        </div>
                    </div>
                )
            });

            setAntropometrias(todasAntropometrias);
        });
    }, []);

    async function deleteAntropometria(id) {
        if (!confirm('Tem certeza que deseja deletar essa medição?')) return;

        setIsLoading(true);

        try {
            await axios.delete(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/metas/' + sessionStorage.getItem('meta') + '/antropometrias/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }
            });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Medição removida com sucesso!</li>]);
            setTimeout(() => window.location.href = '/ver-antropometrias', 1000);
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
                <title>Smart Health - Ver as medições</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Ver as medições" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Ver as medições" />
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
                        <div className={styles1.exams}>
                            <h2 className='subtitle' style={{ marginBottom: "30px" }}>Minhas medições</h2>
                            {antropometrias}
                            <div className={[styles1.card_chart, styles1.novosexames].join(" ")}>
                                <p>
                                    Adicione uma nova medição para acompanhar sua evolução.
                                </p>
                                <Link className='ajuda' href='/adicionar-antropometria'>Adicionar medição</Link>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

async function getAllAntropometrias(setIsLoading) {
    setIsLoading(true);

    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/metas/' + sessionStorage.getItem('meta') + '/antropometrias', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            }
        });

        return response.data;
    }
    catch (e) { 
        return [];
    }
    finally {
        setIsLoading(false);
    }
}
