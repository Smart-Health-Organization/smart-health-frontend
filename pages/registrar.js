import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SnackBar from '@/components/SnackBarComponent';
import Loading from '@/components/LoadingComponent';
import onEnter from '@/functions/onEnter';
import tryLogin from '@/functions/tryLogin';
import DateComponent from '@/components/DateComponent';

let first = true;

export default function Register() {

  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (first) {
      tryLogin(setIsLoading, axios);
      document.querySelector("#name").focus();
      first = false;
    }
  });

  async function register() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    const newUser = {
      nome: document.querySelector("#name").value,
      idade: Number(document.querySelector("#age").value),
      sexo: document.querySelector("#sexo").value,
      email: document.querySelector("#email").value,
      senha: document.querySelector("#password").value,
    }

    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/signup', newUser);

      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/login', { email: newUser.email, senha: newUser.senha });

      sessionStorage.setItem("token", "Bearer " + response.data.token);
      sessionStorage.setItem("user", response.data.usuario.id);

      window.location.replace("/dashboard");
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
        <title>Smart Health - Registrar-se</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

        <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

        <meta property="og:title" content="Smart Health - Registrar-se" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

        <meta name="twitter:title" content="Smart Health - Registrar-se" />
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

          <header className='topbar'>
            <Link href={"/"}><h1 className='title' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1></Link>
            <h1 className='title time'><DateComponent date={Date.now()}></DateComponent></h1>
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
                <Link href={"/entrar"}>LOGIN</Link>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Registrar-se
                </h2>
                <p className={styles.description}>
                  Preencha o formulário
                </p>
                <form className={styles.formLogin} style={{ height: '60%' }}>
                  <input onKeyDown={e => onEnter(e, register)} id='name' type='text' placeholder={"Nome"}></input>
                  <input onKeyDown={e => onEnter(e, register)} id='age' type='number' placeholder={"Idade"}></input>
                  <select onKeyDown={e => onEnter(e, register)} id='sexo' >
                    <option value=''>Selecione o sexo</option>
                    <option value='masculino'>Masculino</option>
                    <option value='feminino'>Feminino</option>
                  </select>
                  <input onKeyDown={e => onEnter(e, register)} id='email' type='email' placeholder={"Email"}></input>
                  <input onKeyDown={e => onEnter(e, register)} id='password' type='password' placeholder={"Senha"}></input>
                </form>
                <button disabled={isLoading} onClick={register}>CADASTRAR</button>
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
