import { render } from '@testing-library/react';
import TopBar from '../components/TopBar';

describe('TopBar', () => {
    it('TopBar return a component', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<TopBar />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('TopBar must have a class named "topbar"', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<TopBar />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveClass('topbar');
    });
});