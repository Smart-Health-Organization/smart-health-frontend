import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'

export default function Home() {
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

        <div className='main'>

          <header className='topbar'>
            <h1 className='title' ><Image alt={"Smart Health"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1>
            <Link href={"/login"} className='entrar'>ENTRAR</Link>
          </header>

          <main className='content'>
            <div className={styles.infos}>
              <h2 className={'subtitle'}>
                Software para Gestão de Saúde!
              </h2>
              <p className={styles.description}>
                Armazenamento, acompanhamento e compartilhamento de dados.
              </p>
              <div className={styles.textinfos}>
                <h3 className={styles.funcionalidades}>
                  Nossas Funcionalidades
                </h3>
                <div style={{display: "flex", width: "100%", flexDirection: "row", flexWrap: "wrap"}}>
                  <p className={styles.funcionalidades}>
                    <Image alt={"features"} className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                    Acompanhamento de Antropometria Completa!
                  </p>
                  <p className={styles.funcionalidades}>
                    <Image alt={"features"} className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                    Acompanhamento de Exames Médicos!
                  </p>
                  <p className={styles.funcionalidades}>
                    <Image alt={"features"} className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                    Gestão de Exames Alterados!
                  </p>
                  <p className={styles.funcionalidades}>
                    <Image alt={"features"} className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                    Facilidade no Upload de Exames Médicos!
                  </p>
                  <p className={styles.funcionalidades}>
                    <Image alt={"features"} className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                    Disponibilidade de Compartilhamento de dados!
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.images}>
              <Image alt={"background"} priority className={styles.image1} src={'/background.png'} width={500} height={500}></Image>
            </div>

          </main>

          <footer className='footer'>
            <Link href={"mailto:lima-stefany@outlook.com?subject=Smart Health - Ajuda&body=Olá Smart Health, gostaria ajuda em..."} className='ajuda'>
              <FontAwesomeIcon icon={faQuestionCircle} /> <span className='displayMobile'>Posso ajudar?</span>
            </Link>
          </footer>

        </div>
      </div>
    </>
  )
}
