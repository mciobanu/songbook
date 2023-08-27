/*import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});*/   //ttt1: Make UI testing work (the dummy test below was added so thing would compile)


import {describe, expect, test} from '@jest/globals';

const sum = (a: number, b: number) => {
    return a + b;
};

describe('sum module JS', () => {
    test('adds 3 + 2 to equal 5', () => {
        const c = sum(3, 2);
        expect(c).toBe(5);
    });
});
