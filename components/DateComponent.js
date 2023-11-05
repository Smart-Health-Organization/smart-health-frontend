export default function DateComponent(props = { date: "" }) {
    if (!props.date) return;
    const date = new Date(props.date);
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const formatDate = day + " de " + month + ", " + year + ".";

    return formatDate;
}