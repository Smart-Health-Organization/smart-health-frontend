import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/Profile.module.css'
import DateComponent from '@/components/date'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBar'
import Loading from '@/components/loading'
import axios from 'axios'

let first = true;

export default function Profile() {
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfMessage, setTypeOfMessage] = useState('warning');

  useEffect(() => {
    if (first) {
      async function tryLogin() {
        try {
          if (!(sessionStorage.getItem("token") && sessionStorage.getItem("user"))) {
            window.location.replace("/login");
          }
          const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });

          document.querySelector("#userName").innerHTML = response.data.nome;
          document.querySelector("#name").value = response.data.nome;
          document.querySelector("#userEmail").innerHTML = response.data.email;
          document.querySelector("#email").value = response.data.email;
          document.querySelector("#age").value = response.data.idade;
          document.querySelector("#age2").value = response.data.idade;
          document.querySelector("#sexo").value = response.data.sexo[0].toUpperCase() + response.data.sexo.slice(1);
          document.querySelector("#sexo2").value = response.data.sexo[0].toUpperCase() + response.data.sexo.slice(1);

        }
        catch {
          window.location.replace("/login");
        }
      }
      tryLogin();
      first = false;
    }
  });

  function onEnter(e) {
    if (e.key != 'Enter') return;

    if (!e.target.nextElementSibling) {
      return;
    }

    e.target.nextElementSibling.focus();
  }

  async function changePassword(e) {
    if ((e.key && e.key != 'Enter') || isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    try {
      await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/redefinir-senha',
        { senhaAntiga: document.querySelector("#oldPassword").value, NovaSenha: document.querySelector("#newPassword").value },
        { headers: { Authorization: sessionStorage.getItem("token") } });

      setTypeOfMessage('success');
      setErrorMessages([<li key={0}>Senha alterada com sucesso!</li>]);
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

  async function patch(e) {
    if ((e.key && e.key != 'Enter') || isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    const newUser = {
      nome: document.querySelector("#name").value,
      idade: Number(document.querySelector("#age2").value),
      sexo: document.querySelector("#sexo2").value,
      email: document.querySelector("#email").value,
    }

    try {
      await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), newUser, { headers: { Authorization: sessionStorage.getItem("token") } });

      setTypeOfMessage('success');
      setErrorMessages([<li key={0}>Alteração feita com sucesso!</li>]);

      setTimeout(window.location.replace("/profile"), 3000);
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

  function confirmDelete() {
    let choice = confirm("Tem certeza que deseja deletar sua conta?");
    if (!choice) return;
    deleteAccount();
  }

  async function deleteAccount() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    try {
      await axios.delete(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      setTypeOfMessage('success');
      setErrorMessages([<li key={0}>Conta deletada com sucesso!</li>]);

      setTimeout(window.location.replace("/exit"), 3000);
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

  return (
    <>
      <Head>
        <title>Smart Health - Meu perfil</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

        <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

        <meta property="og:title" content="Smart Health - Meu perfil" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

        <meta name="twitter:title" content="Smart Health - Meu perfil" />
        <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
        <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
      <Loading on={isLoading}></Loading>

      <div className='container'>

        <LeftMenu></LeftMenu>

        <div className='main authPage'>

          <header className='topbar'>
            <h1 className='title displayMobile'>Smart Health</h1>
            <MobileMenu></MobileMenu>
            <DateComponent date={Date.now()}></DateComponent>
          </header>

          <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
            <div className={styles.profile}>
              <h2 className={'subtitle'}>
                Meu perfil
              </h2>

              <h3 className={styles.userInfos} id='userName'>Nome Sobrenome</h3>
              <p className={styles.userInfos} id='userEmail'>email@mail.com</p>
              <div className={styles.userInfos}>
                <div>
                  <label><input className={styles.age} readOnly value={0} type='number' id='age'></input> anos</label>
                  <input readOnly value={"Sexo"} type='text' id='sexo'></input>
                </div>
              </div>

              <hr className={styles.hr}></hr>

              <div className={styles.userInfos}>
                <h2 className={'subtitle'}>
                  Editar informações
                </h2>
                <div className={styles.changePassword}>
                  <input className={styles.edit} id='name' onKeyDown={onEnter} placeholder='Nome' type='text'></input>
                  <input className={styles.edit} id='email' onKeyDown={onEnter} placeholder='Email' type='email'></input>
                  <input className={styles.edit} id='sexo2' onKeyDown={onEnter} placeholder='Sexo' type='text'></input>
                  <input className={styles.edit} id='age2' onKeyDown={patch} placeholder='Idade' type='number'></input>
                </div>
              </div>
              <button style={{ marginBottom: '30px' }} disabled={isLoading} onClick={patch} className='ajuda'>
                Alterar os dados
              </button>

              <hr className={styles.hr}></hr>

              <div className={styles.userInfos}>
                <h2 className={'subtitle'}>
                  Trocar senha
                </h2>
                <div className={styles.changePassword}>
                  <input className={styles.edit} id='oldPassword' onKeyDown={onEnter} placeholder='Senha atual' type='password'></input>
                  <input className={styles.edit} id='newPassword' onKeyDown={changePassword} placeholder='Nova senha' type='password'></input>
                </div>
              </div>
              <button style={{ marginBottom: '30px' }} disabled={isLoading} onClick={changePassword} className='ajuda'>
                Trocar senha
              </button>

              <hr className={styles.hr}></hr>

              <div className={styles.userInfos}>
              </div>
              <button style={{ marginBottom: '30px' }} disabled={isLoading} onClick={confirmDelete} className='ajuda delete'>
                Deletar conta
              </button>

            </div>
          </main>

          <footer className='invisibleFooter'>
          </footer>
        </div>
      </div>
    </>
  )
}
