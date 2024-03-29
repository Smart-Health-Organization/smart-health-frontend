import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/Profile.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import TopBar from '@/components/TopBar'
import onEnter from '@/functions/onEnter'
import tryLogin from '@/functions/tryLogin'

export default function Profile() {
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfMessage, setTypeOfMessage] = useState('warning');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [userInfoRef, setUserInfoRef] = useState({});

  useEffect(() => {
    tryLogin(setIsLoading, axios, false).then((response) => {
      setNome(response.nome);
      setEmail(response.email);
      setDataDeNascimento(response.dataDeNascimento);
      setSexo(response.sexo);

      setUserInfoRef(response);
    });
  }, []);

  async function changePassword() {
    setErrorMessages([]);

    setIsLoading(true);

    try {
      await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/redefinir-senha',
        { senhaAntiga: document.querySelector("#oldPassword").value, novaSenha: document.querySelector("#newPassword").value },
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

  async function patch() {
    setErrorMessages([]);

    setIsLoading(true);

    let newUser = {
      nome: nome != userInfoRef.nome ? nome : null,
      dataDeNascimento: dataDeNascimento != userInfoRef.dataDeNascimento ? (dataDeNascimento + "T00:00:00.000Z") : null,
      sexo: sexo != userInfoRef.sexo ? sexo : null,
      email: email != userInfoRef.email ? email : null,
    }

    newUser = Object.fromEntries(Object.entries(newUser).filter(([_, v]) => v != null));

    if (!Object.keys(newUser).length) {
      setTypeOfMessage('info');
      setErrorMessages([<li key={0}>Nenhuma alteração.</li>]);
      setIsLoading(false);
      return;
    }

    if (newUser.sexo === '') {
      setTypeOfMessage('info');
      setErrorMessages([<li key={0}>Selecione um sexo.</li>]);
      setIsLoading(false);
      return;
    }

    try {
      await axios.patch(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), newUser, { headers: { Authorization: sessionStorage.getItem("token") } });

      setTypeOfMessage('success');
      setErrorMessages([<li key={0}>Alteração feita com sucesso!</li>]);

      setTimeout(window.location.replace("/perfil"), 3000);
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

      setTimeout(window.location.replace("/sair"), 3000);
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
        <title>Smart Health - Meu Perfil</title>
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

        <LeftMenu actualpage='/perfil'></LeftMenu>

        <div className='main authPage'>

          <TopBar actualpage='/perfil'></TopBar>

          <main className='content' style={{ flexDirection: 'column', marginBottom: '25px' }}>
            <div className={styles.profile}>
              <h2 className={'subtitle'}>
                Meu Perfil
              </h2>

              <div className={styles.form}>
                <h3 className={styles.userInfos} id='userName'>{userInfoRef.nome || "Nome Sobrenome"}</h3>
                <p className={styles.userInfos} id='userEmail'>{userInfoRef.email || "email@mail.com"}</p>
                <p className={styles.userInfos2}>
                  {(new Date().getFullYear() - new Date(dataDeNascimento).getFullYear()) || 0} anos, {' ' + (userInfoRef.sexo ? userInfoRef.sexo[0].toUpperCase() + userInfoRef.sexo.slice(1) : "Sexo")}.
                </p>

                <hr className={styles.hr}></hr>

                <div className={styles.userInfos}>
                  <h2 className={'subtitle'}>
                    Editar informações
                  </h2>
                  <div className={styles.changePassword}>
                    <label><strong>Nome:</strong> <input className={styles.edit} id='name' onKeyDown={e => onEnter(e, patch)} onChange={(e) => setNome(e.target.value)} placeholder='Nome Sobrenome' type='text' value={nome}></input></label>
                    <label><strong>Email:</strong> <input className={styles.edit} id='email' onKeyDown={e => onEnter(e, patch)} onChange={(e) => setEmail(e.target.value)} placeholder='email@mail.com' type='email' value={email}></input></label>
                    <label>
                      <strong>Sexo:</strong>
                      &nbsp;
                      <select value={sexo} onKeyDown={e => onEnter(e, patch)} onChange={(e) => setSexo(e.target.value)} id='sexo2'>
                        <option value=''>Selecione o sexo</option>
                        <option value='masculino'>Masculino</option>
                        <option value='feminino'>Feminino</option>
                      </select>
                    </label>
                    <label><strong>Data de Nascimento:</strong> <input className={styles.edit} id='age2' onKeyDown={e => onEnter(e, patch)} onChange={(e) => setDataDeNascimento(e.target.value)} placeholder='Data de Nascimento' type='date' value={dataDeNascimento.split("T")[0]}></input></label>
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
                    <label><input className={styles.edit} id='oldPassword' onKeyDown={e => onEnter(e, changePassword)} placeholder='Senha atual' type='password'></input></label>
                    <label><input className={styles.edit} id='newPassword' onKeyDown={e => onEnter(e, changePassword)} placeholder='Nova senha' type='password'></input></label>
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

            </div>
          </main>

          <footer className='invisibleFooter'>
          </footer>
        </div>
      </div>
    </>
  )
}
