import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className='main'>
        <header className='topbar'>
          <h1 className='title' ><Image src={'/favicon.png'} width={62.25} height={58.5}></Image> Smart Health</h1>
          <a className='entrar'>ENTRAR</a>
        </header>

        <main className='container'>
          <div>
            <h2 className={styles.description}>
              Software para Gestão de Saúde!
            </h2>
            <p className={styles.description}>
              Armazenamento, acompanhamento e compartilhamento de dados.
            </p>
          </div>
          <div className={styles.infos}>
            <div className={styles.textinfos}>
              <h3 className={styles.funcionalidades}>
                Nossas Funcionalidades
              </h3>
              <p className={styles.funcionalidades}>
                <Image className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                Acompanhamento de Antropometria Completa!
              </p>
              <p className={styles.funcionalidades}>
                <Image className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                Acompanhamento de Exames Médicos!
              </p>
              <p className={styles.funcionalidades}>
                <Image className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                Gestão de Exames Alterados!
              </p>
              <p className={styles.funcionalidades}>
                <Image className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                Facilidade no Upload de Exames Médicos!
              </p>
              <p className={styles.funcionalidades}>
                <Image className={styles.funcionalidades} src={'/item.png'} width={15} height={22}></Image>
                Disponibilidade de Compartilhamento de dados!
              </p>
            </div>
            <div className={styles.images}>
              <Image className={styles.image1} src={'/background.png'} width={500} height={500}></Image>
            </div>
          </div>
        </main>

        <footer className='footer'>
          <p>
            <FontAwesomeIcon className='icon' icon={faInstagram} />
            <FontAwesomeIcon className='icon' icon={faFacebookSquare} />
            <FontAwesomeIcon className='icon' icon={faLinkedin} />
          </p>
          <a className='ajuda'>
            <FontAwesomeIcon icon={faQuestionCircle} /> Posso ajudar?
          </a>
        </footer>

        <div className='left-menu'></div>
      </div>
    </>
  )
}
