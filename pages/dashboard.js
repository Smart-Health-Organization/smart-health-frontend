import LeftMenu from "@/components/LeftMenuComponent";
import TopBar from "@/components/TopBar";
import Head from "next/head";
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className='container'>

                <LeftMenu actualpage="/dashboard" ></LeftMenu>

                <div className='main authPage dashboard'>

                    <main className='content'>
                        <TopBar actualpage="/dashboard"></TopBar>


                    </main>

                    <aside className={styles.aside}>
                        <div className={styles.imc}>
                            <div className={styles.title}>
                                <h3>Calculadora de IMC</h3>
                            </div>
                            <div className={styles.body}>
                                <div className={styles.info}>
                                    <div className={styles.altura}>
                                        <img src="./peso_altura.png"></img>
                                        <p><span>Altura: </span><input type="number" placeholder="185 cm"></input></p>
                                    </div>
                                    <div className={styles.peso}>
                                        <img src="./peso_altura.png"></img>
                                        <p><span>Peso: </span><input type="number" placeholder="82 kg"></input></p>
                                    </div>
                                </div>
                                <div className={styles.result}>
                                    <h4>Índice de Massa Corporal (IMC)</h4>
                                    <h3>0 Kg/m³</h3>
                                    <h4 className={styles.alertGreen}>IMC Normal</h4>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={styles.antropometria}>
                            <div className={styles.title}>
                                <h3>Antropometria</h3>
                            </div>
                            <div className={styles.body}>
                                <h1>Em breve!</h1>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}