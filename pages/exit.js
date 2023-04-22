import Head from 'next/head'
import DateComponent from '@/components/date'
import { useEffect } from 'react'
import Loading from '@/components/loading'

export default function Exit() {
  useEffect(() => {

    sessionStorage.clear();

    setTimeout(() => {
      window.location.replace("/");
    }, 1500);
  });

  return (
    <>
      <Head>
        <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Loading on={true}> </Loading>

      <div className='container'>

        <div className='main authPage' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <h1 className='title displayMobile'>Smart Health</h1>
            <DateComponent date={Date.now()}></DateComponent>
          </header>

          <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
            <h1>Saindo da conta...</h1>
          </main>
        </div>
      </div>
    </>
  )
}
