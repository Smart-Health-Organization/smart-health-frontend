import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link';
import DateComponent from '@/components/date';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SnackBar from '@/components/SnackBar';
import Loading from '@/components/loading';

export default function Register() {

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

    document.querySelector("#name").focus();
  });

  function onEnter(e) {
    if (e.key != 'Enter') return;

    if (!e.target.nextElementSibling) {
      register();
      return;
    }

    e.target.nextElementSibling.focus();
  }

  async function register() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    const newUser = {
      name: document.querySelector("#name").value,
      age: Number(document.querySelector("#age").value),
      sexo: document.querySelector("#sexo").value,
      email: document.querySelector("#email").value,
      login: document.querySelector("#login").value,
      password: document.querySelector("#password").value,
    }

    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/signup', newUser);

      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/login', { email: newUser.email, password: newUser.password });

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
        <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
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
                <form className={styles.formLogin} style={{ height: '70%' }}>
                  <input onKeyDown={onEnter} id='name' type='text' placeholder={"Nome"}></input>
                  <input onKeyDown={onEnter} id='age' type='number' placeholder={"Idade"}></input>
                  <select onKeyDown={onEnter} id='sexo' >
                    <option value=''>Selecione o sexo</option>
                    <option value='masculino'>Masculino</option>
                    <option value='feminino'>Feminino</option>
                  </select>
                  <input onKeyDown={onEnter} id='email' type='email' placeholder={"Email"}></input>
                  <input onKeyDown={onEnter} id='login' type='text' placeholder={"Login"}></input>
                  <input onKeyDown={onEnter} id='password' type='password' placeholder={"Senha"}></input>
                </form>
                <button disabled={isLoading} onClick={register}>Cadastrar</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
