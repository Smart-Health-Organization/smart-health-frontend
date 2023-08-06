import { render } from '@testing-library/react';
import MobileMenu from '../components/MobileMenuComponent';
import MobileMenuItem from '@/components/MobileMenuItem';

describe('MobileMenu', () => {
    it('Mobile return a component', () => {
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
        const renderredComponent = render(<MobileMenuItem path={"/qualquer-link"} />, );

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveAttribute('href', '/qualquer-link');
    });

    //todo: testar estilo
    //todo: testar openMenu
    //todo: testar closeMenu
    //todo: testar useEffect
});