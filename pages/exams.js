import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/Exams.module.css'
import DateComponent from '@/components/date'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBar'
import Loading from '@/components/loading'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Chart from 'chart.js/auto'
import { faDna } from '@fortawesome/free-solid-svg-icons'

let first = true;

export default function Exams() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [canvas, setCanvas] = useState([]);

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

            showExams(response.data.data);
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

    async function showExams(examsList) {
        console.log(examsList);

        Object.keys(examsList).forEach((examitem) => {
            const canvas = <div className={styles.card_chart} key={examitem + "card"}>
                <div className={styles.chart_info}>
                    <h3><FontAwesomeIcon icon={faDna} /> {examitem}</h3>
                    <h3 className={styles.gray}>ATUAL</h3>
                    <h2>{examsList[examitem][0].medida} <span className={styles.gray}>{examsList[examitem][0].unidade}</span> <span className={styles.isAlterado}>{examsList[examitem][0].isAlterado ? "Alterado" : "Normal"}</span></h2>
                </div>
                <div key={examitem + "div"} className={styles.chart_container}>
                    <canvas width="4" height="1" className='examItem' key={examitem} id={examitem}></canvas>
                </div>
            </div>;
            setCanvas((oldCanvas) => [...oldCanvas, canvas]);
        });

        setTimeout(() => {

            for (let examitem in examsList) {
                let data = examsList[examitem];

                data = data.reverse();

                console.log(data)

                if (!document.getElementById(examitem))
                    continue;

                new Chart(
                    document.getElementById(examitem),
                    {
                        type: 'line',
                        data: {
                            labels: data.map(row => new Date(row.data).toLocaleDateString()),
                            datasets: [
                                {
                                    label: examitem + ' - ' + data[0].unidade,
                                    data: data.map(row => row.medida),
                                    borderColor: "#F3A53F",
                                    backgroundColor: "rgba(248, 222, 189, 0.6)",
                                    borderWidth: 4,
                                    fill: true,
                                }
                            ]
                        },
                        options: {
                            cubicInterpolationMode: 'monotone',
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        }
                    }
                );
            }
        });
    }

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
                        <div className={styles.exams}>
                            <h2 className='subtitle'>Meus exames</h2>
                            {canvas}
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}