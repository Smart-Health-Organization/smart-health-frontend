import LeftMenu from '@/components/LeftMenu'
import MobileMenu from '@/components/MobileMenu'
import Head from 'next/head'
import styles from '@/styles/Exams.module.css'
import DateComponent from '@/components/DateComponent'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
import { faDna } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import TopBar from '@/components/TopBar'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

let first = true;

export default function Exams() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [charts, setCharts] = useState([]);

    useEffect(() => {
        if (first) {
            tryLogin(setIsLoading, axios, false);
            getExams();
            first = false;
        }
    }, []);

    async function getExams() {
        setIsLoading(true);
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/exame-itens', { headers: { Authorization: sessionStorage.getItem("token") } });

            await showExams(response.data.data);
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
            setTimeout(() => { setIsLoading(false) });
        }
    }

    async function showExams(examsList) {
        Object.keys(examsList).forEach((examitem) => {
            let dataExam = [...examsList[examitem]];
            dataExam = dataExam.reverse();

            const data = {
                labels: dataExam.map(row => new Date(row.data).toLocaleDateString()),
                datasets: [
                    {
                        label: examitem + ' - ' + dataExam[0].unidade,
                        data: dataExam.map(row => row.medida),
                        borderColor: "#F3A53F",
                        backgroundColor: "rgba(248, 222, 189, 0.6)",
                        borderWidth: 4,
                        fill: true,
                    }
                ]
            };

            const options = {
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
            }

            const chart = <div className={styles.card_chart} key={examitem}>
                <div className={styles.chart_info}>
                    <h3><FontAwesomeIcon icon={faDna} /> {examitem}</h3>
                    <h3 className={styles.gray}>ATUAL</h3>
                    <h2>{examsList[examitem][0].medida} <span className={styles.gray}>{examsList[examitem][0].unidade}</span> <span className={styles.isAlterado}>{examsList[examitem][0].isAlterado ? "Alterado" : "Normal"}</span></h2>
                </div>
                <div className={styles.chart_container}>
                    <Line
                        data={data}
                        options={options}
                    />
                </div>
            </div>;
            setCharts((oldCharts) => [...oldCharts, chart]);
        });
    }

    return (
        <>
            <Head>
                <title>Smart Health - Ver Exame</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Ver Exame" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Ver Exame" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <LeftMenu actualpage='/ver-exames'></LeftMenu>

                <div className='main authPage'>

                    <TopBar actualpage='/ver-exames'></TopBar>


                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.exams}>
                            <h2 className='subtitle' style={{ marginBottom: "30px" }}>Meus exames</h2>
                            {isLoading ?
                                null
                                : charts.length > 0
                                    ? charts
                                    : <h2>Nenhum exame cadastrado. Adicione exames <Link style={{ color: "#E79B38" }} href={"/adicionar-exames"}>aqui</Link>. </h2>
                            }
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}