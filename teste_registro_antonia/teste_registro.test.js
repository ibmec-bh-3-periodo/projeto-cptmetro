const { salvarUsuario, validarLogin } = require('./teste_registro');

describe('Funções de Registro e Login', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('salvarUsuario deve salvar no localStorage se todos os campos forem preenchidos', () => {
        const result = salvarUsuario('Ibmec', 'ibmec@gmail.com', '123456');
        expect(result).toBe(true);
        expect(localStorage.getItem('username')).toBe('Ibmec');
        expect(localStorage.getItem('email')).toBe('ibmec@gmail.com');
        expect(localStorage.getItem('password')).toBe('123456');
    });

    test('salvarUsuario deve retornar false se algum campo estiver vazio', () => {
        const result = salvarUsuario('Ibmec', '', '123456');
        expect(result).toBe(false);
    });

    test('validarLogin deve retornar true se email e senha forem corretos', () => {
        salvarUsuario('Tamara', 'tamara@gmail.com', 'senha123');
        const result = validarLogin('tamara@gmail.com', 'senha123');
        expect(result).toBe(true);
    });

    test('validarLogin deve retornar false se email ou senha estiverem errados', () => {
        salvarUsuario('Metro', 'metro@gmail.com', 'senha321');
        const result = validarLogin('metro@gmail.com', 'errada');
        expect(result).toBe(false);
    });
});
