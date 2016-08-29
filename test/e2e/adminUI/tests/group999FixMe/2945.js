module.exports = {
	before: function (browser) {
		browser.adminUIApp = browser.page.adminUIApp();
		browser.adminUISignin = browser.page.adminUISignin();
		browser.adminUIListScreen = browser.page.adminUIListScreen();
		browser.adminUIItemScreen = browser.page.adminUIItemScreen();
		browser.adminUIInitialFormScreen = browser.page.adminUIInitialForm();

		browser.app.gotoHomeScreen();
		browser.adminUIApp.waitForSigninScreen();

		browser.adminUISignin.signin();
		browser.adminUIApp.waitForHomeScreen();
	},
	after: function (browser) {
		browser.adminUIApp.signout();
		browser.end();
	},
	'List screen must show ID column if it has neither default nor name columns': function(browser) {
		// Create items
		browser.adminUIApp.openMiscList('NoDefaultColumn');
		browser.adminUIListScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.adminUIInitialFormScreen.fillFieldInputs({
			listName: 'NoDefaultColumn',
			fields: {
				'fieldA': {value: 'testing'},
			}
		});
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		// If no default is set, the ID should be used.
		browser.adminUIApp.navigate('http://localhost:3000/keystone/no-default-columns');
		browser.adminUIListScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
	},
	'List screen must show requested columns': function(browser) {
		// If specific columns have been requested, they should be shown.
		browser.adminUIApp.navigate('http://localhost:3000/keystone/no-default-columns?columns=id%2CfieldA');
		browser.adminUIListScreen.expect.element('@firstColumnHeader').text.to.equal('ID');
		browser.adminUIListScreen.expect.element('@secondColumnHeader').text.to.equal('Field A');

	}
};
