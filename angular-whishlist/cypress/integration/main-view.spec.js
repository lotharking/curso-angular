describe('ventana principal', () => {
    it('tiene encabezado correcto y español por defecto', () => {
        cy.visit('http://localhost:4200');
        cy.contains('Home');
        cy.contains('angular-whishlist');
        cy.get('h1 b').should('contain', 'HOLA es'); 
    });

    it('Ingresar nuevo destino', () => {
        cy.visit('http://localhost:4200');
        cy.get('.form-group').find('[id="nombre"]').type('cartago');     
        cy.get('button').click()    
        cy.contains('se ha elegido a cartago')
    });
});