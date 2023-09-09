import { render } from '@testing-library/react';
import ProgressBar from '../components/ProgressBar';

describe('ProgressBar', () => {
    it('ProgressBar return a component', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<ProgressBar />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toBeInTheDocument();
    });

    it('ProgressBar must have a class named "progressBar"', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<ProgressBar />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement).toHaveClass('progressBar');
    });

    it('ProgressBar child must have the same width of the progress prop', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<ProgressBar progress={70} />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement.childNodes.item(0)).toHaveStyle('width: 70%');
    });
    
    it('ProgressBar child must have the same background color of the color prop', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<ProgressBar color='#000' />,);

        // 2. pegar o elemento que será testado
        const returnElement = renderredComponent.container.firstChild;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnElement.childNodes.item(0)).toHaveStyle('backgroundColor: #000');
    });
});