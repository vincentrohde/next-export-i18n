import { NextRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'node:querystring';

export function setRouterQuery({ router, query, shallow }: {
  router: NextRouter,
  query?: ParsedUrlQueryInput,
  shallow: boolean
}) {
  return router.push(
    {
      pathname: router.pathname,
      query,
    },
    undefined,
    { shallow }
  );
}
