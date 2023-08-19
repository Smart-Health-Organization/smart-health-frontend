import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/Compartilhamentos.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import TopBar from '@/components/TopBar'
import Link from 'next/link'

export default function Compartilhamentos() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(true);

    const [todosCompartilhamentos, setTodosCompartilhamentos] = useState([]);
    const [compartilhamentosBuscados, setcompartilhamentosBuscados] = useState([]);

    const [hasDeleted, setHasDeleted] = useState(0);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        setIsLoading(true);
        getCompartilhamentos(setErrorMessages, setIsLoading, setTypeOfMessage, deleteExameCompartilhado).then((response) => setTodosCompartilhamentos(response));
    }, []);

    useEffect(() => {
        search('');
    }, [todosCompartilhamentos]);

    useEffect(() => {
        setIsLoading(true);
        getCompartilhamentos(setErrorMessages, setIsLoading, setTypeOfMessage, deleteExameCompartilhado).then((response) => setTodosCompartilhamentos(response));
    },[hasDeleted]);

    function search(string) {
        if (string === '') {
            setcompartilhamentosBuscados(todosCompartilhamentos);
            return;
        }

        const searchedExams = todosCompartilhamentos.filter((compartilhamento) => compartilhamento.props['data-title'].toUpperCase().startsWith(string.toUpperCase()));
        setcompartilhamentosBuscados(searchedExams);
        return;
    }

    return (
        <>
            <Head>
                <title>Smart Health - Compartilhamentos</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Compartilhamentos" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Compartilhamentos" />
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
                            <h2 className='subtitle' style={{ marginBottom: "30px" }}>Meus compartilhamentos</h2>
                            {todosCompartilhamentos.length > 0 ? <>
                                <input onChange={(e) => search(e.target.value)} className={styles.search} placeholder='Pesquise compartilhamentos'></input>
                                {compartilhamentosBuscados}
                            </> : <></>}
                            <div className={[styles.card_chart, styles.novosexames].join(" ")}>
                                <p>
                                    Crie novos compartilhamentos para que seus médicos possam acompanhar seus exames.
                                </p>
                                <Link className='ajuda' href='/compartilhamento'>Criar</Link>
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )

    async function deleteExameCompartilhado(id) {
        const ifYes = confirm("Tem certeza que deseja deletar este compartilhamento?");
        if (!ifYes) return;
    
        setIsLoading(true);
        try {
            await axios.delete(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/exames-compartilhados/' + id,
                { headers: { Authorization: sessionStorage.getItem("token") } });
    
            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Apagado com sucesso</li>]);
            setHasDeleted(hasDeleted + 1);
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
}

export async function getCompartilhamentos(setErrorMessages, setIsLoading, setTypeOfMessage, deleteExameCompartilhado) {
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/exames-compartilhados',
            { headers: { Authorization: sessionStorage.getItem("token") } });

        const compartilhamentosGetted = []

        response.data.forEach((dados) => {
            compartilhamentosGetted.push(
                <div key={dados.id} data-title={dados.titulo} className={[styles.card_chart, styles.compartilhamentos].join(' ')}>
                    <div>
                        <p><strong>Compartilhamento #{dados.id}</strong></p>
                        <p><strong>Título:</strong> &quot;{dados.titulo}&quot;</p>
                        <p><strong>Id:</strong> &quot;{dados.login}&quot;</p>
                    </div>
                    <button className='ajuda delete' onClick={async () => await deleteExameCompartilhado(dados.id)}>Deletar</button>
                </div>
            );
        });

        return compartilhamentosGetted;

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