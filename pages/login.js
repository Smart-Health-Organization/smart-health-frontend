import Head from 'next/head'
import styles from '@/styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link';
import DateComponent from '@/components/date';

export default function Login() {
  
  return (
    <>
      <Head>
        <title>Smart Health - Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde</title>
        <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className='container'>

        <div className='main' style={{ justifyContent: 'flex-start' }}>

          <header className='topbar'>
            <Link href={"./"}><h1 className='title' ><Image alt={"logo"} src={'/favicon.png'} width={62.25} height={58.5}></Image>  <span className='displayMobile'>Smart Health</span></h1></Link> 
            <DateComponent date={Date.now()}></DateComponent>
          </header>

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
                <Link href={"/register"}>REGISTRAR</Link>
              </div>

              <div className={styles.loginDiv}>
                <h2 className={styles.description}>
                  Entre
                </h2>
                <p className={styles.description}>
                  Insira email e senha
                </p>
                <form className={styles.formLogin}>
                  <input type='email' placeholder={"Email"}></input>
                  <input type='password' placeholder={"Senha"}></input>
                </form>
                <a>Entrar</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
