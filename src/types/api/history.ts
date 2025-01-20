import type { paths } from '../../openapi/schema';

export type History =
  paths['/history']['get']['responses']['200']['content']['application/json']['history'];
