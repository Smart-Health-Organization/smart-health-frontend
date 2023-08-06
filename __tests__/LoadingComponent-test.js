import { render } from '@testing-library/react';
import LoadingComponent from '../components/LoadingComponent';

describe('LoadingComponent', () => {
    it('LoadingComponent return an element when on', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<LoadingComponent on={true} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('LoadingComponent return null when off', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<LoadingComponent on={false} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).not.toBeInTheDocument();
    });

    it('LoadingComponent must have a class named "loadingBar"', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<LoadingComponent on={true} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveClass('loadingBar');
    });
});