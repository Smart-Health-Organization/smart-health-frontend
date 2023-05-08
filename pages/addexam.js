import LeftMenu from '@/components/leftMenu'
import MobileMenu from '@/components/mobileMenu'
import Head from 'next/head'
import styles from '@/styles/AddExam.module.css'
import DateComponent from '@/components/date'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBar'
import Loading from '@/components/loading'
import axios from 'axios'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

let first = true;

export default function AddExam() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [examList, setExamList] = useState([]);

    useEffect(() => {
        if (first) {
            tryLogin(setIsLoading, axios, false);
            first = false;
        }
    });

    function onChangeFileSelector(e) {
        const fileList = e.target.files;
        readPDF(fileList[0]);
    }

    function dragOverHandler(ev) {
        ev.preventDefault();
    }

    function dropHandler(ev) {
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    readPDF(file);
                }
            });
        } else {
            [...ev.dataTransfer.files].forEach((file, i) => {
                readPDF(file);
            });
        }
    }

    function readPDF(file) {
        if (!file || !file.type)
            return;
        if (file.type != "application/pdf") {
            setErrorMessages([<li key={0}>Deve ser um arquivo PDF</li>]);
            return;
        }
        console.log(file);
        return;
    }

    async function addExamItem() {
        setErrorMessages([]);
        await setExamList(examList => [...examList, <ExamItem key={examList.length - 1}></ExamItem>]);
        document.querySelector('#examList').lastChild.scrollIntoView();
    }

    async function uploadExam() {
        const examDate = document.querySelector("#examDate").value;
        if (examDate == "") {
            setErrorMessages([<li key={0}>Selecione uma data</li>]);
            return;
        }
        const examDateFormatted = new Date(examDate);
        const examDateFormattedString = examDateFormatted.getDate() + "/" + (examDateFormatted.getMonth() + 1) + "/" + examDateFormatted.getFullYear();

        const examList = document.querySelectorAll('div[class*="exam_item"]');

        if (examList.length == 0) {
            setErrorMessages([<li key={0}>Adicione pelo menos um exame</li>]);
            return;
        }

        const exams = [];
        for (let i=0; i<examList.length; i++) {
            let exam = {};
            exam.exam = examList[i].querySelector('.exame').value;
            if (exam.name === "")
                continue;
            exam.medida = examList[i].querySelector('.medida').value;
            if (exam.medida === "")
                continue;
            exam.umedida = examList[i].querySelector('.umedida').value;
            if (exam.resultado === "")
                continue;
            exams.push(exam);
        }
        if (exams.length == 0) {
            setErrorMessages([<li key={0}>Adicione pelo menos um exame</li>]);
            return;
        }

        const data = {
            date: examDateFormattedString,
            itens: exams
        }

        console.log(data);
    }   

    return (
        <>
            <Head>
                <title>Smart Health - Cadastrar Exame</title>
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
                        <div className={styles.addexam}>
                            <h2 className='subtitle'>Carregar meus exames</h2>
                            <div id={styles.drop_zone} onDrop={dropHandler} onDragOver={dragOverHandler}>
                                <label>
                                    <FontAwesomeIcon icon={faCloudArrowUp} className={styles.drop_icon} />
                                    <h3>Arraste e solte ou clique para subir um arquivo PDF.</h3>
                                    <input type="file" id={styles.file_selector} accept=".pdf" onChange={onChangeFileSelector} />
                                </label>
                            </div>

                            <h3>Para adicionar um exame manualmente clique no botão <strong>" <FontAwesomeIcon icon={faPlus} /> "</strong>.</h3>

                            <div id={"examList"} className={styles.exam_list}>
                                {examList}
                                <div id={styles.addExamItem}>
                                    <button onClick={addExamItem} className='ajuda'><FontAwesomeIcon icon={faPlus} /></button>
                                </div>
                            </div>

                            <h3>Data de realização do exame:</h3>
                            <input id='examDate' type='date'></input>

                            <hr className={styles.hr}></hr>

                            <button onClick={uploadExam} id={styles.upload} className='ajuda'>Carregar</button>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

function ExamItem(props) {

    function deleteExamItem(e) {
        if (e.button != 0)
            return;
        if (e.target.parentElement.parentElement.className === 'delete') {
            e.target.parentElement.parentElement.parentElement.remove();
            return;
        }
        if (e.target.parentElement.className === 'delete') {
            e.target.parentElement.parentElement.remove();
            return;
        }
        e.target.parentElement.remove();
    }

    return (
        <div className={styles.exam_item}>
            <input className={"exame"} placeholder='Exame' type='text' defaultValue={props.exame} />
            <h3>:</h3>
            <input className={"medida"} placeholder='Medida' type='text' defaultValue={props.medida} />
            <input className={"umedida"} placeholder='Unidade de medida' type='text' defaultValue={props.umedida} />
            <button onMouseUp={deleteExamItem} className='delete'><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    );
}