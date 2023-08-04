import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link';
import DateComponent from '@/components/DateComponent';
import SnackBar from '@/components/SnackBarComponent';
import Loading from '@/components/LoadingComponent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import onEnter from '@/functions/onEnter';
import tryLogin from '@/functions/tryLogin';
import TopBar from '@/components/TopBar';

let first = true;

export default function Login() {

  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (first) {
      tryLogin(setIsLoading, axios);
      document.querySelector("#email").focus();
      first = false;
    }
  });

  async function login() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/login', { email: document.querySelector("#email").value, senha: document.querySelector("#password").value });

      sessionStorage.setItem("token", "Bearer " + response.data.token);
      sessionStorage.setItem("user", response.data.usuario.id);

      window.location.replace("/ver-exames");
    }
    catch (error) {
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
        
        <div className='main'>

          <TopBar actualpage='/entrar'></TopBar>

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
                <Link href={"/registrar"}>REGISTRAR</Link>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Entre
                </h2>
                <p className={styles.description}>
                  Insira email e senha
                </p>
                <form className={styles.formLogin}>
                  <input onKeyDown={e => onEnter(e, login)} id='email' type='email' placeholder={"Email"}></input>
                  <input onKeyDown={e => onEnter(e, login)} id='password' type='password' placeholder={"Senha"}></input>
                </form>
                <button disabled={isLoading} onClick={login}>ENTRAR</button>
              </div>
            </div>
          </main>

          <footer className='invisibleFooter'>
          </footer>
        </div>
      </div>
    </>
  )
}
