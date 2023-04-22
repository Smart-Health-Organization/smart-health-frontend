import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/Profile.module.css'
import DateComponent from '@/components/date'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBar'
import Loading from '@/components/loading'
import axios from 'axios'

export default function Profile() {
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfMessage, setTypeOfMessage] = useState('warning');

  useEffect(() => {

    async function tryLogin() {
      try {
        if (!(sessionStorage.getItem("token") && sessionStorage.getItem("user"))) {
          window.location.replace("/login");
        }
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/users/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });
        
        document.querySelector("#userName").innerHTML = response.data.name;
        document.querySelector("#userEmail").innerHTML = response.data.email;
        document.querySelector("#age").value = response.data.age;
        document.querySelector("#sexo").value = response.data.sexo[0].toUpperCase() + response.data.sexo.slice(1);

      }
      catch { 
        window.location.replace("/login");
      }
    }

    tryLogin();
  });

  function onEnter(e) {
    if (e.key != 'Enter') return;

    if (!e.target.nextElementSibling) {
      changePassword();
      return;
    }

    e.target.nextElementSibling.focus();
  }

  async function changePassword() {
    if (isLoading) return;

    setErrorMessages([]);

    setIsLoading(true);

    try {
      await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/users/' + sessionStorage.getItem("user") + '/resetpassword',
      { oldPassword: document.querySelector("#oldPassword").value, newPassword: document.querySelector("#newPassword").value},
      { headers: { Authorization: sessionStorage.getItem("token") } });

      setTypeOfMessage('success');
      setErrorMessages([<li>Senha alterada com sucesso!</li>]);
    }
    catch (error) {
      setTypeOfMessage('warning');
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

      <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
      <Loading on={isLoading}></Loading>

      <div className='container'>

        <LeftMenu></LeftMenu>

        <div className='main authPage' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <h1 className='title displayMobile'>Smart Health</h1>
            <MobileMenu></MobileMenu>
            <DateComponent date={Date.now()}></DateComponent>
          </header>

          <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
            <h1 style={{ margin: 0 }}>Configuração - Meu perfil</h1>

            <h2 className={styles.userInfos} id='userName'>Nome Sobrenome</h2>
            <p className={styles.userInfos} id='userEmail'>email@mail.com</p>
            <div className={styles.userInfos}>
              <div>
                <label><input readOnly value={0} type='number' id='age'></input> anos</label>
                <input readOnly value={"Sexo"} type='text' id='sexo'></input>
              </div>
              <div>
                <label><input readOnly placeholder='Peso' type='number'></input> kg</label>
                <label><input readOnly placeholder='Altura' type='number'></input> cm</label>
              </div>
            </div>

            <hr style={{width: "50%", textAlign: "left", margin: "0"}}></hr>

            <div className={styles.userInfos}>
              <div className={styles.changePassword}>
                <input id='oldPassword' onKeyDown={onEnter} placeholder='Senha atual' type='password'></input>
                <input id='newPassword' onKeyDown={onEnter} placeholder='Nova senha' type='password'></input>
              </div>
            </div>
            <button disabled={isLoading} onClick={changePassword} className='ajuda'>
              Trocar senha
            </button>
          </main>
        </div>
      </div>
    </>
  )
}
