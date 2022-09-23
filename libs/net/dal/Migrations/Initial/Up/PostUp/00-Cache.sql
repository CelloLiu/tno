DO $$
DECLARE DEFAULT_USER_ID UUID := '00000000-0000-0000-0000-000000000000';
BEGIN

INSERT INTO public.cache (
  "key"
  , "value"
  , "description"
  , "created_by_id"
  , "created_by"
  , "updated_by_id"
  , "updated_by"
) VALUES (
  'claims' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'roles' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'users' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'actions' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'source_actions' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'metrics' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'categories' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'tags' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'tone_pools' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'products' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'ingest_types' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'licenses' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'series' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'connections' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'ingests' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'sources' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
), (
  'lookups' -- key
  , gen_random_uuid() -- value
  , '' -- description
  , DEFAULT_USER_ID
  , ''
  , DEFAULT_USER_ID
  , ''
);

END $$;
