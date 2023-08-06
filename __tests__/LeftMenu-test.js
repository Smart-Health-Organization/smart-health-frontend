import { render } from '@testing-library/react';
import LeftMenu from '../components/LeftMenuComponent';
import LeftMenuItem from '@/components/LeftMenuItem';

describe('LeftMenu', () => {
    it('LeftMenu return a component', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<LeftMenu />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('LeftMenuItem href attribute must be the same of path', async () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<LeftMenuItem path={"/qualquer-link"} />, );

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveAttribute('href', '/qualquer-link');
    });

    //todo: testar estilo
});