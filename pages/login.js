import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [date, setDate] = useState("date");

  useEffect(() => {
    const dateNow = Date.now();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let dateAux = new Date(dateNow);

    let day = dateAux.getDate();
    let month = months[dateAux.getMonth()];
    let year = dateAux.getFullYear();
    setDate(day + " de " + month + ", " + year);
  });

  return (
    <>
      <Head>
        <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className='container'>

        <div className='left-menu'></div>

        <div className='main' style={{justifyContent: 'flex-start'}}>

          <header className='topbar'>
            <h1 className='title' ><Image src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1>
            <h1 className='title time'>{date}</h1>
          </header>

          <main className='content' style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.login}>
              <div className={styles.notRegister}>
                <Image src={'/favicon_white.png'} width={62.25} height={58.5}></Image>
                <h2 className={styles.description}>
                  Seja bem-vindo&#40;a&#41;!
                </h2>
                <p className={styles.description}>
                  Não tem uma conta? Registre agora mesmo.
                </p>
                <a>REGISTRAR</a>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Entre
                </h2>
                <p className={styles.description}>
                  Insira email e senha
                </p>
                <form className={styles.formLogin}>
                  <input type='email' placeholder={"Email"}></input>
                  <input type='password' placeholder={"Senha"}></input>
                </form>
                <a>Entrar</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
