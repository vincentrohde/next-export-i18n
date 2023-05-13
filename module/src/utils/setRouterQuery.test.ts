import { setRouterQuery } from './setRouterQuery';
import { NextRouter } from 'next/router';

describe('setRouterQuery', () => {
  let router: Partial<NextRouter>;

  beforeEach(() => {
    router = {
      push: jest.fn(),
      pathname: '/test',
      query: {},
    };
  });

  test('calls router.push with pathname and query', () => {
    const query = { id: '1', name: 'example' };
    const shallow = false;

    setRouterQuery({ router: router as NextRouter, query, shallow });

    expect(router.push).toHaveBeenCalledWith(
      { pathname: '/test', query },
      undefined,
      { shallow }
    );
  });
});
