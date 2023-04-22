import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link';
import DateComponent from '@/components/date';
import SnackBar from '@/components/SnackBar';
import Loading from '@/components/loading';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Login() {

  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    async function tryLogin() {
      try {
        if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
          await axios.get(process.env.NEXT_PUBLIC_API_URL + '/users/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });
          window.location.replace("/profile");
        }
      }
      catch {}
    }

    tryLogin();

    document.querySelector("#email").focus();
  });

  function onEnter(e) {
    if (e.key != 'Enter') return;

    if (!e.target.nextElementSibling) {
      login();
      return;
    }

    e.target.nextElementSibling.focus();
  }

  async function login() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/login', { email: document.querySelector("#email").value, password: document.querySelector("#password").value });

      sessionStorage.setItem("token", "Bearer " + response.data.token);
      sessionStorage.setItem("user", response.data.user.id);

      window.location.replace("/profile");
    }
    catch (error) {
      if (!error.response.data.message.map) {
        setErrorMessages([<li>{error.response.data.message}</li>]);
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


  return (
    <>
      <Head>
        <title>Smart Health - Entrar</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

        <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />
        
        <meta property="og:title" content="Smart Health - Entrar" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

        <meta name="twitter:title" content="Smart Health - Entrar" />
        <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
        <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <SnackBar option={"warning"} message={errorMessages}></SnackBar>
      <Loading on={isLoading}></Loading>

      <div className='container'>

        <div className='main' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <Link href={"./"}><h1 className='title' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1></Link>
            <DateComponent date={Date.now()}></DateComponent>
          </header>

          <main className='content' style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.login}>
              <div className={styles.notRegister}>
                <Image alt={"logo branca"} src={'/favicon_white.png'} width={62.25} height={58.5}></Image>
                <h2 className={styles.description}>
                  Seja bem-vindo&#40;a&#41;!
                </h2>
                <p className={styles.description}>
                  Não tem uma conta? Registre agora mesmo.
                </p>
                <Link href={"/register"}>REGISTRAR</Link>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Entre
                </h2>
                <p className={styles.description}>
                  Insira email e senha
                </p>
                <form className={styles.formLogin}>
                  <input onKeyDown={onEnter} id='email' type='email' placeholder={"Email"}></input>
                  <input onKeyDown={onEnter} id='password' type='password' placeholder={"Senha"}></input>
                </form>
                <button disabled={isLoading} onClick={login}>Entrar</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
