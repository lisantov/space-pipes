describe('Cypress tests', () => {
    const loginEmployer = () =>
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/login');
            cy.get('input.form-input--text.form-input[type="text"]')
                .type(data.employer_login)

            cy.get('input.form-input--password.form-input[type="password"]')
                .type(data.employer_password);

            cy.get('.login-form__button button[type="submit"]')
                .click()

            cy.wait(1000)
        })

    const loginStudent = () =>
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/login');

            cy.get('input.form-input--text.form-input[type="text"]')
                .type(data.student_login)

            cy.get('input.form-input--password.form-input[type="password"]')
                .type(data.student_password);

            cy.get('.login-form__button button[type="submit"]')
                .click()

            cy.wait(1000)
        })

    it('Валидка регистрации', () => {
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/registration');

            cy.get(':nth-child(1) > :nth-child(1) > .form-control--medium > .form-input--text')
                .type('_)(_)(')

            cy.wait(1000)

            cy.contains('.form-error > span', 'Обязательное поле, символы латиницы, не содержит пробелы')
                .should('exist')

            cy.get('.form-input--email')
                .type('д');

            cy.wait(1000)

            cy.contains('.form-error > span', 'Обязательное поле, некорректная почта')
                .should('exist')

            cy.get(':nth-child(3) > .form-control--medium > .form-input--password')
                .type('00');

            cy.wait(1000)

            cy.contains('.form-error > span', 'Обязательное поле, мин 6 символов, должен содержать буквы в верхнем и нижнем регистре, минимум 1 цифру, не содержать пробелы')
                .should('exist')

            cy.get(':nth-child(4) > .form-control--medium > .form-input--password')
                .type('0');

            cy.wait(1000)

            cy.contains('.form-error > span', 'Пароли не совпадают')
                .should('exist')
        })
    })

    it('Создание стажировки', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/account/internships')

            cy.get('[data-v-e4f6348f=""][data-v-4849dea2=""] > .vacancies-block > .vacancies-block__filters-wrapper > .button')
                .click()

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(1) > .form-control--responsive > .form-input--')
                .type('Стажировка', { force: true })

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(4) > .form-control--responsive > .form-input--date')
                .type('2026-04-24')

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(5) > .form-control--responsive > .form-input--date')
                .type('2026-04-28')

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(6) > [name="requirements"] > .form-area')
                .type('Не для лохов')

            cy.get('.vacancy-add-form-wrapper > .form > :nth-child(1) > .form__labels > .labels > :nth-child(7) > [name="responsibilities"] > .form-area')
                .type('Лоховать')

            cy.get('.vacancy-add-form-wrapper > .form > .form__buttons > .buttons > .button')
                .click({ force: true })

            cy.wait(1000)

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-header > :nth-child(2)')
                .should('exist')
                .should('contain.text', 'Стажировка')

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green')
                .click()

            cy.wait(1000)

            cy.get(':nth-child(1) > .internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green')
                .click()
        })
    })

    it('Поиск + фильтр', () => {
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/internships');

            cy.contains('.internship-header__name', 'Стажировка')
                .should('exist')

            cy.get('.form-input--text.form-input.search-input__field')
                .type('Стажировка')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('exist')

            cy.get('.radio-list > :nth-child(2)')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('not.exist')

            cy.get('.radio-list > :nth-child(3)')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('exist')

            cy.get('.form-select__selected')
                .click()

            cy.contains('.form-select__option', 'Совмещенный')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('not.exist')

            cy.get('.form-select__selected')
                .click()

            cy.contains('.form-select__option', 'Очный')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('exist')

            cy.get('.form-input--text.form-input.search-input__field')
                .clear()
                .type('Стажировкааааа')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.contains('.internship-header__name', 'Стажировка')
                .should('not.exist')
        })
    })

    it('Отклик на стажировку', () => {
        loginStudent()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/internships');

            cy.get('.form-input--text.form-input.search-input__field')
                .type('Стажировка')

            cy.get('div.search-input__field > .button')
                .click()

            cy.wait(1000)

            cy.get('.internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button__background-color-green').first()
                .click()

            cy.contains('.internship-item__info-wrapper > .internship-item__footer-wrapper > .vacancy-footer > .vacancy-footer__button-wrapper > .button', 'Вы уже откликнулись!')
                .should('exist')
        })
    })

    it('Подтверждение отклика', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/account/responses');

            cy.get('.responses-list-item__action:nth-child(1)').first()
                .click()

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .should('exist')
        })
    })

    it('Взаимодействие в рабочем пространстве', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/account/responses');

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .click()

            cy.get('.form-area')
                .type('Алоха')

            cy.get('.comment-textarea__buttons > :nth-child(2)')
                .click()

            cy.contains('.comment-message__text', 'Алоха')
                .should('exist')

            cy.get('.user-avatar-info__button-logout')
                .click()
        })

        loginStudent()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/account/responses');

            cy.contains('.responses-list-item__content-company > .button', 'Рабочее пространство')
                .click()

            cy.contains('.comment-message__text', 'Алоха')
                .should('exist')

            cy.get('.form-area')
                .type('Это семья')

            cy.get('.comment-textarea__buttons > :nth-child(2)')
                .click()

            cy.contains('.comment-message__text', 'Это семья')
                .should('exist')
        })
    })

    it('Смена статуса', () => {
        loginEmployer()
        cy.fixture('cypressTests').then(data => {
            cy.visit(data.main_url + '/account/responses');

            cy.contains('.button.button__background-color-light-blue.button__size-medium.button__color-white.responses-list-item__button-move', 'Рабочее пространство')
                .click()

            cy.get('.status-open__buttons > :nth-child(2)')
                .click()

            cy.contains('.status-close__text', 'Стажировка не пройдена')
                .should('exist')
        })
    })
})