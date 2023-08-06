import { render } from '@testing-library/react';
import DateComponent from '../components/DateComponent';

describe('DateComponent', () => {
    it('DataComponent return empty when has not date prop', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<DateComponent />,);

        // 2. pegar o elemento que será testado
        const returnDate = renderredComponent.container;

        // 3. Aplicar a ação que será testada
        // nada a fazer

        // 4. fazer o teste
        expect(returnDate).toBeEmptyDOMElement();
    });

    it('DateComponent return the formatted date in accord to the date prop', () => {
        // 1. renderizar o componente passando suas props
        const renderredComponent = render(<DateComponent date="2020-01-01 UTC-3" />,);

        // 2. pegar o elemento que será testado
        const returnedDateElement = renderredComponent.container;

        // 3. Aplicar a ação que será testada - pegar a data formatada
        const returnedFormattedDate = returnedDateElement.innerHTML;

        // 4. fazer o teste
        expect(returnedFormattedDate).toEqual("1 de Janeiro, 2020.");
    });
});