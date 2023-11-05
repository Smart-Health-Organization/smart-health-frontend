import { render, waitFor } from '@testing-library/react';
import SnackBarComponent from '../components/SnackBarComponent';

describe('SnackBarComponent', () => {
    it('SnackBarComponent return an element when has message', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<SnackBarComponent message={[<li key={0}>Info Message</li>]} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('SnackBarComponent return null when has not message', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<SnackBarComponent />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).not.toBeInTheDocument();
    });

    it('SnackBarComponent must have a class named "snackbar"', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<SnackBarComponent message={[<li key={0}>Info Message</li>]} option='info' />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveClass('snackbar');
    });

    it('SnackBarComponent faded out after 5000', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<SnackBarComponent message={[<li key={0}>Info Message</li>]} option='info' />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        waitFor(() => expect(returnElement).toHaveClass('snackbarFadeOut'), { interval: 5000, timeout: 5000 });
    });

});