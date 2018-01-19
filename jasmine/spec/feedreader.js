/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */
/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the model
     *  definitions, the model variable in our application.
     */
    describe('model', function() {
        /* This is our first test - it tests to make sure that the
         * model variable has been defined and that it is not
         * empty.
         */
        it('is defined', function() {
            expect(model).toBeDefined();
            expect(model.length).not.toBe(0);
        });
        /* A test that ensures the model has a locations defined
         * and that the location is not empty.
         */

        it('locations are defined', function() {
                expect(model.locations).toBeDefined();
                expect(model.locations.length).not.toBe(0);
        });

        /* A test that ensures the model has a restaurants object defined
         * and that the restaurant object is not empty.
         */
        it('restaurants are defined', function() {
                expect(model.restaurants).toBeDefined();
                expect(model.restaurants.length).not.toBe(0);
        });
    });

    /* New test suite named "The list" */
    describe('The list', function() {
        /* A test that ensures the menu element is
         * displayed by default.
         */
        it('is displayed by default', function() {
            expect($('#navigation').hasClass('displaylist')).toBe(true);
        });
    });
});
