import { useEffect, useState } from "react";

export default function DateComponent(props) {
    const [date, setDate] = useState("date");

    useEffect(() => {
        const dateNow = props.date;
        const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        let dateAux = new Date(dateNow);

        let day = dateAux.getDate();
        let month = months[dateAux.getMonth()];
        let year = dateAux.getFullYear();
        setDate(day + " de " + month + ", " + year);
    });

    return (
        <h1 className='title time'>{date}</h1>
    );
}