import Head from 'next/head'
import styles from '@/styles/Shared.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDna } from '@fortawesome/free-solid-svg-icons'
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
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DateComponent from '@/components/DateComponent'
import { dicionarioAntropometrias } from '../acompanhar-meta'
import ProgressBar from '@/components/ProgressBar'

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

export default function Compartilhados() {
    const router = useRouter();

    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [compartilhamentos, setCompartilhamentos] = useState([]);
    const [titulo, setTitulo] = useState('');

    const [authed, setAuthed] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => { verifyId() }, [router.isReady]);

    useEffect(() => {
        if (isValid && document && document.querySelector('#senha'))
            document.querySelector('#senha').focus();
    }, [isValid]);

    async function auth(e) {
        if (e.key && e.key !== 'Enter') return;
        const enteredSenha = document.querySelector('#senha').value;
        setIsLoading(true);
        const response = await getCompartilhamentos(router.query.id, enteredSenha);
        setCompartilhamentos(response);
    }

    async function verifyId() {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/exames-compartilhados/' + router.query.id);
            if (!response.data) throw new Error();
            setIsValid(true);
        } catch (e) { }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Smart Health - Compartilhados</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Compartilhados" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Compartilhados" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <div className='main'>

                    <header className='topbar'>
                        <Link href={"/"}><h1 className='title' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1></Link>
                        <h1 className='title time'><DateComponent date={Date.now()}></DateComponent></h1>
                    </header>

                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.exams}>
                            {isValid
                                ?
                                <>
                                    {!authed &&
                                        <h2 className='subtitle' style={{ marginBottom: "30px" }}>Olá, você recebeu esses exames. Insira a senha para acessar: </h2>}
                                    {(compartilhamentos && compartilhamentos.length > 0) ? <>
                                        <h2 className='subtitle' style={{ marginBottom: "30px" }}>{titulo}</h2>
                                        {compartilhamentos}
                                    </> : <>
                                        <input id='senha' onKeyDown={auth} className={styles.search} placeholder='Digite a senha' type='password'></input>
                                        <button disabled={isLoading} className='ajuda' onClick={auth}>Acessar</button>
                                    </>}
                                </>
                                : <></>
                            }
                            {(!isValid && !isLoading) &&
                                <>
                                    <h2 className='subtitle' style={{ marginBottom: "30px" }}>Página não encontrada :(</h2>
                                    <Link className='ajuda' href={'./'}>Voltar para home</Link>
                                </>
                            }
                        </div>
                    </main>

                </div>
            </div>
        </>
    )

    async function getCompartilhamentos(login, senha) {
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/exames-compartilhados', { login, senha },
                { headers: { Authorization: sessionStorage.getItem("token") } });

            setTitulo(response.data.titulo);

            let examesLista = [];
            if (response.data.itens) {
                examesLista.push(<h2 key="titulo">Exames</h2>);

                const dados = response.data.itens;

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

                    examesLista.push(<div className={styles.card_chart} key={examitem}>
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
            }

            let metaLista = [];
            if (response.data.meta) {
                const data = response.data.meta;
                const comparativos = data.comparativos;

                metaLista.push(<h2 key="titulo" style={{ marginBottom: '0' }}>Meta</h2>);

                let antropometriasLista = [];

                Object.keys(comparativos).forEach((antropometriaItem) => {
                    let dadosAntropometria = [...comparativos[antropometriaItem]];
                    dadosAntropometria = dadosAntropometria.reverse();

                    const dadosGraficoAntropometria = {
                        labels: dadosAntropometria.map(row => new Date(row.data).toLocaleDateString()),
                        datasets: [
                            {
                                label: 'Em ' + dicionarioAntropometrias[antropometriaItem].umedida,
                                data: dadosAntropometria.map(row => row.medida.toFixed(1)),
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
                                },
                                display: false,
                            },
                            y: {
                                grid: {
                                    display: false,
                                },
                                display: false,
                            },
                        }
                    }

                    antropometriasLista.push(
                        <div className={styles.antropometria} key={antropometriaItem}>
                            <div className={styles.left}>
                                <h3>{dicionarioAntropometrias[antropometriaItem].nome.toUpperCase()}</h3>
                                <h3 className={styles.gray}>ATUAL</h3>
                                <h2>{comparativos[antropometriaItem][0].medida.toFixed(1)} <span className={[styles.gray, styles.umedida].join(" ")}>{dicionarioAntropometrias[antropometriaItem].umedida}</span></h2>
                            </div>
                            <div className={styles.right}>
                                <Line
                                    data={dadosGraficoAntropometria}
                                    options={configuracaoGraficoAntropometria}
                                />
                            </div>
                        </div>
                    );
                });

                const mmagraRestante = (data.massaMagra - comparativos["massaMagra"][0].medida).toFixed(1);
                const gcorporalRestante = (data.gorduraCorporal - comparativos["gorduraCorporal"][0].medida).toFixed(1);
                const mmagraRestanteProgress = 100 - Math.abs(((comparativos["massaMagra"][0].medida * 100) / data.massaMagra) - 100).toFixed(1);
                const gcorporalRestanteProgress = 100 - Math.abs(((comparativos["gorduraCorporal"][0].medida * 100) / data.gorduraCorporal) - 100).toFixed(1);

                metaLista.push(
                    <div className={styles.form} key="meta">
                        <div className={styles.body}>
                            <div>
                                <p>Falta <strong>{mmagraRestante}Kg</strong> para atingir a Massa Magra Almejada de <strong>{data.massaMagra}Kg</strong>.</p>
                                <ProgressBar color='#55C66E' progress={mmagraRestanteProgress} />
                            </div>
                            <div>
                                <p>Falta <strong>{gcorporalRestante}%</strong> para atingir a Gordura Corporal Almejada de <strong>{data.gorduraCorporal}%</strong>.</p>
                                <ProgressBar color='#55C66E' progress={gcorporalRestanteProgress} />
                            </div>
                            <h3>Antropometria</h3>
                            {antropometriasLista}
                        </div>
                    </div>
                );
            }

            setErrorMessages([]);
            setAuthed(true);

            return examesLista.concat(metaLista);
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

            if (document && document.querySelector('#senha'))
                document.querySelector('#senha').focus();
        }
        finally {
            setIsLoading(false);
        }
    }
}
