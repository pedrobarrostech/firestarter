import { ArticleModule } from './article.module';

describe('ArticleModule', () => {
  let articlesModule: ArticleModule;

  beforeEach(() => {
    articlesModule = new ArticleModule();
  });

  it('should create an instance', () => {
    expect(articlesModule).toBeTruthy();
  });
});
