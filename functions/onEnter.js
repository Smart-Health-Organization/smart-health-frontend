export default function onEnter(e, func) {
    if (e.key != 'Enter') return;

    if (!e.target.nextElementSibling) {
        e.target.blur();
        func();
        return;
    }

    e.target.nextElementSibling.focus();
}