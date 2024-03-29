import LeftMenu from '@/components/LeftMenuComponent'
import Head from 'next/head'
import styles from '@/styles/AddExam.module.css'
import { useEffect, useState } from 'react'
import SnackBar from '@/components/SnackBarComponent'
import Loading from '@/components/LoadingComponent'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import tryLogin from '@/functions/tryLogin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import TopBar from '@/components/TopBar'

export default function AddExam() {
    const [errorMessages, setErrorMessages] = useState([]);
    const [typeOfMessage, setTypeOfMessage] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);

    const [examList, setExamList] = useState([]);
    const [metricas, setMetricas] = useState([]);

    useEffect(() => {
        tryLogin(setIsLoading, axios, false);
        getMetricas();
    }, []);

    async function getMetricas() {
        await axios.get(process.env.NEXT_PUBLIC_API_URL + '/metricas', { headers: { Authorization: sessionStorage.getItem("token") } }).then(response => {
            for (let [index, item] of response.data.entries()) {
                setMetricas(metricas => [...metricas, <option key={index + 1} id={item.nome} value={item.nome}>{item.nome}</option>]);
            }
        });
    }

    function onChangeFileSelector(e) {
        setErrorMessages([]);

        const fileList = e.target.files;
        readPDF(fileList[0]);

        e.target.value = null;
    }

    function dragOverHandler(ev) {
        setErrorMessages([]);

        ev.preventDefault();
    }

    function dropHandler(ev) {
        setErrorMessages([]);

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

    async function readPDF(file) {
        setErrorMessages([]);

        if (!file || !file.type)
            return;
        if (file.type != "application/pdf") {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Deve ser um arquivo PDF</li>]);
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/exames/pdf', formData, { headers: { Authorization: sessionStorage.getItem("token") } });

            const list = [];
            for (let item of response.data.itens) {
                list.push(addExamItem(null, item.metrica, item.medida, item.unidade, metricas));
            }
            setExamList(list);

            setTimeout(() => {
                document.querySelector('#examList').lastChild.scrollIntoView();
            });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Exame lido com sucesso!</li>]);
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

    function addExamItem(e, selectedExame = null, medidaItem = "", umedidaItem = "", exameList = []) {
        const newExame = <ExamItem key={uuidv4()} examItemId={uuidv4()} exameNome={selectedExame} medida={medidaItem} umedida={umedidaItem} exames={exameList} removeExamItem={removeExamItem}></ExamItem>;
        return newExame;
    }

    async function removeExamItem(id) {
        setErrorMessages([]);
        setExamList(examList => examList.filter(item => item.props.examItemId != id));
    }

    async function uploadExam() {
        setErrorMessages([]);

        const examDate = document.querySelector("#examDate").value;
        if (examDate == "") {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Selecione uma data</li>]);
            return;
        }
        const examDateFormatted = examDate + "T03:00:00.000Z";

        const examList = document.querySelectorAll('div[class*="exam_item"]');

        if (examList.length == 0) {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Adicione pelo menos um exame</li>]);
            return;
        }

        const exams = [];
        for (let i = 0; i < examList.length; i++) {
            let exam = {};
            exam.metrica = examList[i].querySelector('.exame > option:checked').value;
            if (exam.metrica === "")
                continue;
            exam.medida = Number(examList[i].querySelector('.medida').value);
            if (exam.medida === 0)
                continue;
            exam.unidade = examList[i].querySelector('.umedida').value;
            if (exam.unidade === "")
                continue;
            exams.push(exam);
        }
        if (exams.length == 0) {
            setTypeOfMessage('info');
            setErrorMessages([<li key={0}>Adicione pelo menos um exame</li>]);
            return;
        }

        const data = {
            data: examDateFormatted,
            itens: exams
        }

        setIsLoading(true);
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/usuarios/' + sessionStorage.getItem("user") + '/exames', data, { headers: { Authorization: sessionStorage.getItem("token") } });

            setTypeOfMessage('success');
            setErrorMessages([<li key={0}>Exames carregados com sucesso!</li>]);

            setExamList([]);
            document.querySelector("#examDate").value = "";
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
                <title>Smart Health - Cadastrar Exame</title>
                <meta name="description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />

                <meta name="keywords" content="smart, health, plataforma, web, armazenamento, acompanhamento, compartilhamento, seguro, resultados, exames, informacoes, saude" />

                <meta property="og:title" content="Smart Health - Cadastrar Exame" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
                <meta property="og:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />

                <meta name="twitter:title" content="Smart Health - Cadastrar Exame" />
                <meta name="twitter:description" content="Plataforma Web para Armazenamento, Acompanhamento e Compartilhamento Seguro de Resultados de Exames e Informações de Saúde." />
                <meta name="twitter:image" content={process.env.NEXT_PUBLIC_URL + '/favicon.png'} />
                <meta name="twitter:card" content="summary_large_image" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <SnackBar option={typeOfMessage} message={errorMessages}></SnackBar>
            <Loading on={isLoading}></Loading>

            <div className='container'>

                <LeftMenu actualpage='/adicionar-exames'></LeftMenu>

                <div className='main authPage'>

                    <TopBar actualpage='/adicionar-exames'></TopBar>

                    <main className='content' style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', marginBottom: '25px' }}>
                        <div className={styles.addexam}>
                            <h2 className='subtitle'>Carregar meus exames</h2>
                            <div id={styles.drop_zone} onDrop={dropHandler} onDragOver={dragOverHandler}>
                                <label>
                                    <FontAwesomeIcon icon={faCloudArrowUp} className={styles.drop_icon} />
                                    <h3>Arraste e solte ou clique para subir um arquivo PDF.</h3>
                                    <input type="file" id={styles.file_selector} accept=".pdf" onInput={onChangeFileSelector} />
                                </label>
                            </div>

                            <div id={"examList"} className={styles.exam_list}>
                                {examList}
                            </div>

                            <h3>Data de realização do exame:</h3>
                            <input id='examDate' type='date'></input>

                            <hr className={styles.hr}></hr>

                            <button disabled={isLoading} onClick={uploadExam} id={styles.upload} className='ajuda'>Carregar</button>
                        </div>
                    </main>

                </div>
            </div>
        </>
    )
}

function ExamItem(props) {

    const [defaultValue, setDefaultValue] = useState(props.exameNome || "0");

    function deleteExamItem(e, removeExamItem) {
        if (e.button != 0)
            return;
        if (e.target.parentElement.parentElement.className === 'delete') {
            removeExamItem(e.target.parentElement.parentElement.parentElement.id);
            return;
        }
        if (e.target.parentElement.className === 'delete') {
            removeExamItem(e.target.parentElement.parentElement.id);
            return;
        }
        removeExamItem(e.target.parentElement.id);
    }

    return (
        <div id={props.examItemId} className={styles.exam_item}>
            <select disabled className={"exame"} name='Exame' defaultValue={defaultValue}>
                <option value="0">Selecione um exame</option>
                {props.exames}
            </select>
            <h3>:</h3>
            <input disabled className={"medida"} placeholder='Medida' type='text' defaultValue={props.medida} />
            <input disabled className={"umedida"} placeholder='Unidade de medida' type='text' defaultValue={props.umedida} />
            <button onMouseUp={e => deleteExamItem(e, props.removeExamItem)} className='delete'><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    );
}