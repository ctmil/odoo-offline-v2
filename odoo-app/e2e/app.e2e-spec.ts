import { OdooAppPage } from './app.po';

describe('odoo-app App', function() {
  let page: OdooAppPage;

  beforeEach(() => {
    page = new OdooAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
