import { MaswQuizPage } from './app.po';

describe('masw-quiz App', () => {
  let page: MaswQuizPage;

  beforeEach(() => {
    page = new MaswQuizPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
