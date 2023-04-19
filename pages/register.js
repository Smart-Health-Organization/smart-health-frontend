import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link';

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

        <div className='main' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <Link href={"./"}><h1 className='title' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1></Link>
            <h1 className='title time'>{date}</h1>
          </header>

          <main className='content' style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.login}>
              <div className={styles.notRegister}>
                <Image alt={"logo"} src={'/favicon_white.png'} width={62.25} height={58.5}></Image>
                <h2 className={styles.description}>
                  Seja bem-vindo&#40;a&#41;!
                </h2>
                <p className={styles.description}>
                  Já é cadastrado? Acesse sua conta agora mesmo.
                </p>
                <Link href={"/login"}>LOGIN</Link>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Registrar-se
                </h2>
                <p className={styles.description}>
                  Preencha o formulário
                </p>
                <form className={styles.formLogin} style={{ height: '60%' }}>
                  <input type='text' placeholder={"Nome"}></input>
                  <input type='number' placeholder={"Idade"}></input>
                  <input type='email' placeholder={"Email"}></input>
                  <input type='text' placeholder={"Login"}></input>
                  <input type='password' placeholder={"Senha"}></input>
                </form>
                <a>Cadastrar</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
