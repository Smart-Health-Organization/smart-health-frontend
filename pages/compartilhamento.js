import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/Share.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDna, faShare } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
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
import TopBar from '@/components/TopBar'
import Link from 'next/link'

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

export default function Exams() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [exames, setExames] = useState([]);
    const [examesBuscados, setExamesBuscados] = useState([]);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        setIsLoading(true);
        getExamesMini(setErrorMessages, setIsLoading).then((response) => setExames(response));
    }, []);

    useEffect(() => {
        search('');
    }, [exames]);

    function search(string) {
        if (string === '') {
            setExamesBuscados(exames);
            return;
        }

        const searchedExams = exames.filter((exam) => exam.key.toUpperCase().startsWith(string.toUpperCase()));
        setExamesBuscados(searchedExams);
        return;
    }

    return (
        <>
            <Head>
                <title>Smart Health - Compartilhamento</title>
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

                <LeftMenu actualpage='/compartilhamento'></LeftMenu>

                <div className='main authPage'>

                    <TopBar actualpage='/compartilhamento'></TopBar>


                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.exams}>
                            <h2 className='subtitle' style={{ marginBottom: "30px" }}>Compartilhamento</h2>
                            <div className={styles.callaction}>
                                <p>Compartilhe seus exames de forma rápida, prática e segura!</p>
                                <ul>
                                    <li>Escolha um título;</li>
                                    <li>Selecione quais exames que deseja compartilhar e;</li>
                                    <li>Clique no botão compartilhar ao final da página.</li>
                                </ul>
                                <p>Pronto! Agora é só enviar o link (ou QR Code) com a senha gerada para quem você deseja compartilhar seus exames.</p>
                            </div>
                            <h3>Escolha um título (Esse título irá aparecer para a pessoa que receber o link):</h3>
                            <input className={styles.search} placeholder='Digite um título'></input>
                            <h3>Selecione os exames que deseja compartilhar:</h3>
                            {exames.length > 0 ? <>
                                <input onChange={(e) => search(e.target.value)} className={styles.search} placeholder='Pesquise exames'></input>
                                <div className={styles.examsList}>
                                    {examesBuscados}
                                </div>
                            </> : <div className={styles.novosexames}>
                                <p>
                                    Adicione novos exames para acompanhar sua evolução.
                                </p>
                                <Link className='ajuda' href='/adicionar-exames'>Adicionar</Link>
                            </div>}
                            <button className='ajuda'><FontAwesomeIcon icon={faShare} /> Compartilhar</button>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

export async function getExamesMini(setErrorMessages, setIsLoading) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/exame-itens',
            { headers: { Authorization: sessionStorage.getItem("token") } });

        let examesLista = [];
        const dados = response.data.data;

        Object.keys(dados).forEach((examitem) => {
            let dadosExames = [...dados[examitem]];
            dadosExames = dadosExames.reverse();

            const dadosGraficoExame = {
                labels: dadosExames.map(row => new Date(row.data).toLocaleDateString()),
                datasets: [
                    {
                        label: examitem + ' - ' + dadosExames[0].unidade,
                        data: dadosExames.map(row => row.medida),
                        borderColor: "#F3A53F",
                        backgroundColor: "rgba(248, 222, 189, 0.6)",
                        borderWidth: 4,
                        fill: true,
                    }
                ]
            };

            const configuracaoGraficoExame = {
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

            examesLista.push(<div className={styles.card_chart} key={examitem} onClick={selected}>
                <div className={styles.chart_info}>
                    <h3><FontAwesomeIcon icon={faDna} /> {examitem}</h3>
                    <h3 className={styles.gray}>ATUAL</h3>
                    <h2>{dados[examitem][0].medida} <span className={[styles.gray, styles.umedida].join(" ")}>{dados[examitem][0].unidade}</span> <span data-isalterado={dados[examitem][0].isAlterado} className={styles.isAlterado}>{dados[examitem][0].isAlterado ? "Alterado" : "Normal"} <span className={styles.tooltip}><FontAwesomeIcon icon={faCircleQuestion} /> <span className={styles.tooltiptext}>De acordo com o Ministério da Saúde.</span></span></span></h2>
                </div>
                <div className={styles.chart_container}>
                    <Line
                        data={dadosGraficoExame}
                        options={configuracaoGraficoExame}
                    />
                </div>
            </div>);
        });

        return examesLista;
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

    function selected(e) {
        const element = e.target.closest('.' + styles.card_chart);
        if (element.classList.contains(styles.selected)) {
            element.classList.remove(styles.selected);
            return;
        }
        element.classList.add(styles.selected);
    }
}