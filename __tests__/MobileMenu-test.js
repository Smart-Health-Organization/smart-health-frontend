import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../components/MobileMenuComponent';
import MobileMenuItem from '@/components/MobileMenuItem';

describe('MobileMenu', () => {
    it('MobileMenu return a component', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<MobileMenu />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('MobileMenuItem href attribute must be the same of path', async () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<MobileMenuItem path={"/qualquer-link"} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveAttribute('href', '/qualquer-link');
    });

    it('MobileMenu must have a class named "divMenuMobile"', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<MobileMenu />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveClass('divMenuMobile');
    });

    it('MobileMenu when clicked, it open', async  () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<MobileMenu />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        await userEvent.click(((await screen.findByTestId('mobileMenu')).querySelector('a#openMenu')));

        // 4. fazer o teste
        expect(returnElement.childNodes.item(0)).not.toBeVisible();
        expect(returnElement.childNodes.item(1)).toBeVisible();
    });

    
    it('When clicked out of MobileMenu, it close', async  () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<MobileMenu />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        await userEvent.click(document.body);

        // 4. fazer o teste
        expect(returnElement.childNodes.item(0)).toBeVisible();
        expect(returnElement.childNodes.item(1).childNodes.item(0)).not.toBeVisible();
    });
});