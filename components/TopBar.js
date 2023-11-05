import DateComponent from "./DateComponent";
import MobileMenu from "./MobileMenuComponent";

export default function TopBar(props = { actualpage: "/" }) {
    return (
        <header className='topbar'>
            <h1 className='title displayMobile'>Smart Health</h1>
            <MobileMenu actualpage={props.actualpage}></MobileMenu>
            <h1 className='title time'><DateComponent date={Date.now()}></DateComponent></h1>
        </header>
    );
}