import LeftMenu from '@/components/leftMenu';
import Head from 'next/head'
import Image from 'next/image'
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

        <div className='main' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <h1 className='title displayMobile' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image> Smart Health</h1>
            <LeftMenu isMobile></LeftMenu>
            <h1 className='title time'>{date}</h1>
          </header>

          <main className='content' style={{ justifyContent: 'center', alignItems: 'center' }}>

          </main>
        </div>
      </div>
    </>
  )
}
