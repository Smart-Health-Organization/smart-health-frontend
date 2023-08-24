import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/Profile.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import TopBar from '@/components/TopBar'

export default function Profile() {
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typeOfMessage, setTypeOfMessage] = useState('warning');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [nomeRef, setNomeRef] = useState('');
  const [emailRef, setEmailRef] = useState('');
  const [dataDeNascimentoRef, setDataDeNascimentoRef] = useState('');
  const [sexoRef, setSexoRef] = useState('');

  useEffect(() => {
    async function tryLogin() {
      setIsLoading(true);
      try {
        if (!(sessionStorage.getItem("token") && sessionStorage.getItem("user"))) {
          window.location.replace("/entrar");
        }
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user"), { headers: { Authorization: sessionStorage.getItem("token") } });

        setNome(response.data.nome);
        setEmail(response.data.email);
        setDataDeNascimentoRef(response.data.dataDeNascimento);
        setSexo(response.data.sexo);
        setNomeRef(response.data.nome);
        setEmailRef(response.data.email);
        setDataDeNascimento(response.data.dataDeNascimento);
        setSexoRef(response.data.sexo);
      }
      catch {
        window.location.replace("/entrar");
      }
      finally {
        setIsLoading(false);
      }
    }
    tryLogin();
  }, []);

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

    let newUser = {
      nome: nome != nomeRef ? nome : null,
      dataDeNascimento: dataDeNascimento != dataDeNascimentoRef ? (dataDeNascimento + "T00:00:00.000Z") : null,
      sexo: sexo != sexoRef ? sexo : null,
      email: email != emailRef ? email : null,
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

          <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
            <div className={styles.profile}>
              <h2 className={'subtitle'}>
                Meu Perfil
              </h2>

              <h3 className={styles.userInfos} id='userName'>{nomeRef || "Nome Sobrenome"}</h3>
              <p className={styles.userInfos} id='userEmail'>{emailRef || "email@mail.com"}</p>
              <p className={styles.userInfos2}>
                {(new Date().getFullYear() - new Date(dataDeNascimento).getFullYear()) || 0} anos, {' ' + (sexoRef ? sexoRef[0].toUpperCase() + sexoRef.slice(1) : "Sexo")}.
              </p>

              <hr className={styles.hr}></hr>

              <div className={styles.userInfos}>
                <h2 className={'subtitle'}>
                  Editar informações
                </h2>
                <div className={styles.changePassword}>
                  <label><strong>Nome:</strong> <input className={styles.edit} id='name' onKeyDown={onEnter} onChange={(e) => setNome(e.target.value)} placeholder='Nome Sobrenome' type='text' value={nome}></input></label>
                  <label><strong>Email:</strong> <input className={styles.edit} id='email' onKeyDown={onEnter} onChange={(e) => setEmail(e.target.value)} placeholder='email@mail.com' type='email' value={email}></input></label>
                  <label>
                    <strong>Sexo:</strong>
                    &nbsp;
                    <select value={sexo} onKeyDown={onEnter} onChange={(e) => setSexo(e.target.value)} id='sexo2'>
                      <option value=''>Selecione o sexo</option>
                      <option value='masculino'>Masculino</option>
                      <option value='feminino'>Feminino</option>
                    </select>
                  </label>
                  <label><strong>Data de Nascimento:</strong> <input className={styles.edit} id='age2' onKeyDown={patch} onChange={(e) => setDataDeNascimento(e.target.value)} placeholder='Data de Nascimento' type='date' value={dataDeNascimento.split("T")[0]}></input></label>
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
