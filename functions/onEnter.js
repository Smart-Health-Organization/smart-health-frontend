export default function onEnter(e, func) {
    if (e.key != 'Enter') return;

    if (!e.target.parentElement.nextSibling) {
        e.target.blur();
        func();
        return;
    }

    e.target.parentElement.nextSibling.focus();
}