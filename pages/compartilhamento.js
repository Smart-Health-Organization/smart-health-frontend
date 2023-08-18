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
import { faCircleQuestion, faCopy } from '@fortawesome/free-regular-svg-icons'
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
import { fakerPT_BR } from '@faker-js/faker'
import QRCode from 'react-qr-code'

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
    const [selectedAll, setSelectedAll] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [senha, setSenha] = useState('');

    const [compartilhamento, setCompartilhamento] = useState();

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        setIsLoading(true);
        getExamesMini(setErrorMessages, setIsLoading, setTypeOfMessage).then((response) => setExames(response));
    }, []);

    useEffect(() => {
        search('');
    }, [exames]);

    function selectAll(e) {
        if (!selectedAll) {
            setSelectedAll(true);
            document.querySelectorAll('.' + styles.card_chart).forEach((exam) => {
                exam.classList.add(styles.selected);
            });
            e.target.innerText = 'Desmarcar tudo';
            return;
        }
        setSelectedAll(false);
        document.querySelectorAll('.' + styles.card_chart).forEach((exam) => {
            exam.classList.remove(styles.selected);
        });
        e.target.innerText = 'Selecionar tudo';
    }

    function search(string) {
        if (string === '') {
            setExamesBuscados(exames);
            return;
        }

        const searchedExams = exames.filter((exam) => exam.key.toUpperCase().startsWith(string.toUpperCase()));
        setExamesBuscados(searchedExams);
        return;
    }

    async function compartilha() {

        if (titulo === '') {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Informe um título para o compartilhamento.</li>]);
            document.querySelector('#titulo').focus();
            return;
        }

        if (document.querySelectorAll('.' + styles.selected).length === 0) {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Selecione pelo menos um exame para o compartilhamento.</li>]);
            document.querySelector('.' + styles.examsList).focus();
            return;
        }

        setIsLoading(true);

        let examesSelecionados = {};

        document.querySelectorAll('.' + styles.selected).forEach((exam) => {
            const exameSelecionado = JSON.parse(exam.getAttribute('data-data'));
            const index = Object.keys(exameSelecionado)[0];
            examesSelecionados[index] = exameSelecionado[index];
        });

        const senha = fakerPT_BR.location.country().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(' ', '')
        setSenha(senha);

        const data = { titulo, itens: examesSelecionados, senha, confirmacaoSenha: senha };
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem('user') + '/exames-compartilhados', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }
            });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Compartilhamento criado com sucesso.</li>]);

            setCompartilhamento(<>
                <h2 className='subtitle' style={{ marginBottom: "30px" }}>Compartilhamento</h2>
                <div className={styles.callaction}>
                    <p>O compartilhamento "<strong>{titulo}</strong>" foi criado com sucesso!</p>
                    <p>Envie o <strong className={styles.copy} onClick={onCopy} data-href={process.env.NEXT_PUBLIC_URL + '/compartilhados/' + response.data.login}>link <FontAwesomeIcon icon={faCopy} /></strong> e a senha <strong className={styles.copy} onClick={onCopy} data-href={senha}>{senha} <FontAwesomeIcon icon={faCopy} /></strong> com quem deseja compartilhar os seus exames.</p>
                    <p>No lugar do link você pode mostrar o QR Code abaixo para a pessoa que deseja compartilhar:</p>
                    <QRCode style={{ alignSelf: "center", maxWidth: "100%" }} value={process.env.NEXT_PUBLIC_URL + '/compartilhados/' + response.data.login} />
                    {navigator.share && <>
                        <p>Ou se prefirir, clique no botão abaixo e compartilhe diretamente para os seus contatos.</p>
                        <button style={{ alignSelf: "center" }} onClick={() => onShare(response.data.login, senha)} className='ajuda'><FontAwesomeIcon icon={faShare} /> Compartilhar</button>
                    </>
                    }
                </div>
            </>);
        } catch (error) {
            console.log(error);
            setTypeOfMessage('warning');
            if (error.response.data.message.map)
                setErrorMessages(error.response.data.message.map((message, index) => {
                    return <li key={index}>{message}</li>
                }));
            else
                setErrorMessages([<li key={0}>{error.response.data.message}</li>]);
        } finally {
            setIsLoading(false);
        }
    }

    function onCopy(e) {
        navigator.clipboard.writeText(e.target.closest('.' + styles.copy).getAttribute('data-href'));
        setTypeOfMessage('info');
        setErrorMessages([<li key={0}>Copiado para a área de transferência.</li>]);
    }

    function onShare(login, senha) {
        navigator.share({
            title: 'Smart Health - Compartilhamento',
            text: 'Estou compartilhando esses exames com você. A senha é ' + senha + '.',
            url: process.env.NEXT_PUBLIC_URL + '/compartilhados/' + login
        });
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
                            {compartilhamento || <>
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
                                <input id='titulo' onChange={(e) => setTitulo(e.target.value)} className={styles.search} placeholder='Digite um título'></input>
                                <h3>Selecione os exames que deseja compartilhar:</h3>
                                {(exames && exames.length && exames.length > 0) ? <>
                                    <input onChange={(e) => search(e.target.value)} className={styles.search} placeholder='Pesquise exames'></input>
                                    <button className='ajuda' onClick={selectAll}>Selecionar tudo</button>
                                    <div className={styles.examsList}>
                                        {examesBuscados}
                                    </div>
                                </> : <div className={styles.novosexames}>
                                    <p>
                                        Adicione novos exames para acompanhar sua evolução.
                                    </p>
                                    <Link className='ajuda' href='/adicionar-exames'>Adicionar</Link>
                                </div>}
                                <button disabled={isLoading} onClick={compartilha} className='ajuda'><FontAwesomeIcon icon={faShare} /> Criar compartilhamento</button>
                            </>
                            }
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

export async function getExamesMini(setErrorMessages, setIsLoading, setTypeOfMessage) {
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

            examesLista.push(<div className={styles.card_chart} key={examitem} onClick={selected} data-data={JSON.stringify({ [examitem]: dados[examitem] })}>
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