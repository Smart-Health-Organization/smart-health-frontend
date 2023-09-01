import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/SeeMeta.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import TopBar from '@/components/TopBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import ProgressBar from '@/components/ProgressBar'
import { getMeta } from './dashboard'
import Link from 'next/link'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function SeeMeta() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [titulo, setTitulo] = useState('título');
    const [data, setData] = useState('01/01/2024');
    const [mmagra, setMmagra] = useState(0);
    const [gcorporal, setGcorporal] = useState(0);

    const [meta, setMeta] = useState({});
    const [antropometrias, setAntropometrias] = useState([]);
    const [antropometriasShow, setAntropometriasShow] = useState([]);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);

        getMeta(setIsLoading).then((response) => {
            setMeta(response);
            if (response) {
                sessionStorage.setItem('meta', response.id);
                setTitulo(response.titulo);
                setData((new Date(response.dataFim)).toLocaleDateString('pt-BR', { timeZone: 'UTC' }));
                setMmagra(response.massaMagra);
                setGcorporal(response.gorduraCorporal);
            }
        });

    }, []);

    useEffect(() => {
        if (meta.id)
            getAntropometriasByMedidas().then((response) => { setAntropometrias(response) });
    }, [meta]);

    useEffect(() => {
        const antropometriasLista = [];

        Object.keys(antropometrias).forEach((antropometriaItem) => {
            let dadosAntropometria = [...antropometrias[antropometriaItem]];
            dadosAntropometria = dadosAntropometria.reverse();

            const dadosGraficoAntropometria = {
                labels: dadosAntropometria.map(row => new Date(row.data).toLocaleDateString()),
                datasets: [
                    {
                        label: antropometriaItem + ' - cm',
                        data: dadosAntropometria.map(row => row.medida),
                        borderColor: "#F3A53F",
                        backgroundColor: "rgba(248, 222, 189, 0.6)",
                        borderWidth: 4,
                        fill: true,
                    }
                ]
            };

            const configuracaoGraficoAntropometria = {
                cubicInterpolationMode: 'monotone',
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                        }
                    }
                }
            }

            antropometriasLista.push(<div className={styles.form} key={antropometriaItem}>
                <div className={styles.left}>
                    <h3>{antropometriaItem}</h3>
                    <h3>ATUAL</h3>
                    <h2>{antropometrias[antropometriaItem][0].medida} <span>cm</span></h2>
                </div>
                <div className={styles.right}>
                    <Line
                        data={dadosGraficoAntropometria}
                        options={configuracaoGraficoAntropometria}
                    />
                </div>
            </div>);
        });
        setAntropometriasShow(antropometriasLista);
    }, [antropometrias]);

    async function getAntropometriasByMedidas() {
        setIsLoading(true);

        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/metas/' + meta.id + '/antropometrias/comparativos', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
            }
        });

        setIsLoading(false);
        return response.data;
    }

    async function finalizaMeta() {
        if (!confirm('Tem certeza que deseja finalizar essa meta?')) return;

        setIsLoading(true);

        try {
            await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/metas/' + sessionStorage.getItem("meta"), {}, { headers: { Authorization: sessionStorage.getItem("token") } });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Meta Finalizada com sucesso!</li>]);
            setTimeout(() => { window.location.href = '/acompanhar-meta' }, 1000);
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
                <title>Smart Health - Acompanhar Meta</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Acompanhar Meta" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Acompanhar Meta" />
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
                            <h2 className='subtitle'>Acompanhar Meta</h2>
                            {isLoading ? <></> :
                                meta ?
                                    <>
                                        <div className={styles.form}>
                                            <div className={styles.title}>
                                                <h3>{titulo}</h3>
                                                <h3><FontAwesomeIcon icon={faCalendar} /> {data}</h3>
                                            </div>

                                            <div className={styles.body}>
                                                <div>
                                                    <p>Falta <strong>{mmagra}Kg</strong> para atingir a Massa Magra Almejada.</p>
                                                    <ProgressBar color='#55C66E' progress={0} />
                                                </div>
                                                <div>
                                                    <p>Falta <strong>{gcorporal}%</strong> para atingir a Gordura Corporal Almejada.</p>
                                                    <ProgressBar color='#55C66E' progress={0} />
                                                </div>
                                                {antropometriasShow.length > 0 ? antropometriasShow : <></>}
                                                <Link href='/adicionar-antropometria' className='ajuda'>Adicionar Antropometria</Link>
                                                <Link href='/ver-antropometrias' className='ajuda'>Ver todas medições</Link>
                                                <hr></hr>
                                                <button onClick={finalizaMeta} className='ajuda'>Finalizar Meta</button>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={styles.form}>
                                            <div className={styles.title} style={{ flexDirection: 'column' }}>
                                                <h3 style={{ alignSelf: 'center' }}>Você não tem Meta em aberto.</h3>
                                            </div>

                                            <div className={styles.body}>
                                                <Link href='/adicionar-meta' className='ajuda'>Criar uma Meta</Link>
                                            </div>
                                        </div>
                                    </>
                            }
                            <Link href='/todas-metas' className='ajuda'>Ver todas as Metas</Link>
                        </div>
                    </main>

                </div >
            </div >
        </>
    )
}
