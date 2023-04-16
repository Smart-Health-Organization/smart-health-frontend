import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/Profile.module.css'
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

        <LeftMenu></LeftMenu>

        <div className='main authPage' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <h1 className='title displayMobile'>Smart Health</h1>
            <MobileMenu></MobileMenu>
            <h1 className='title time'>{date}</h1>
          </header>

          <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
            <h1>Configuração - Meu perfil</h1>

            <h2 className={styles.userInfos} id='userName'>Nome Sobrenome</h2>
            <p className={styles.userInfos} id='userEmail'>email@mail.com</p>
            <div className={styles.userInfos}>
              <div>
                <label><input readOnly value={0} type='number'></input> anos</label>
                <select>
                  <option value=''>Selecione o sexo</option>
                  {/* <option value='masculino'>Masculino</option>
                  <option value='feminino'>Feminino</option> */}
                </select>
              </div>
              <div>
                <label><input readOnly value={75} type='number'></input> kg</label>
                <label><input readOnly value={185} type='number'></input> cm</label>
              </div>
            </div>

            <div className={styles.userInfos}>
              <div className={styles.changePassword}>
                <input placeholder='Senha atual' type='password'></input>
                <input placeholder='Nova senha' type='password'></input>
              </div>
            </div>
            <a className='ajuda'>
              Trocar senha
            </a>
          </main>
        </div>
      </div>
    </>
  )
}
