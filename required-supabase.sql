-- =============================================
-- ENHANCED SUPABASE SETUP FOR PROFESSIONAL BACKUP
-- =============================================
-- Run this in your Supabase SQL Editor to enable complete schema extraction
-- This creates the necessary functions for professional backup capabilities

-- Create exec_sql function for dynamic query execution
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec RECORD;
    result_array JSONB DEFAULT '[]'::JSONB;
BEGIN
    -- Execute the query and collect results
    FOR rec IN EXECUTE query LOOP
        result_array := result_array || to_jsonb(rec);
    END LOOP;
    
    -- Return the results
    RETURN QUERY SELECT result_array;
EXCEPTION
    WHEN OTHERS THEN
        -- Return error information
        RETURN QUERY SELECT jsonb_build_object(
            'error', SQLERRM,
            'code', SQLSTATE,
            'query', query
        );
END;
$$;

-- Create function to get complete schema information
CREATE OR REPLACE FUNCTION get_complete_schema_info()
RETURNS TABLE(
    schema_name TEXT,
    object_type TEXT,
    object_name TEXT,
    definition TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return tables with column information
    RETURN QUERY
    SELECT 
        t.table_schema::TEXT,
        'table'::TEXT,
        t.table_name::TEXT,
        ''::TEXT,
        jsonb_build_object(
            'table_type', t.table_type,
            'columns', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'column_name', c.column_name,
                        'data_type', c.data_type,
                        'is_nullable', c.is_nullable,
                        'column_default', c.column_default,
                        'ordinal_position', c.ordinal_position,
                        'character_maximum_length', c.character_maximum_length,
                        'numeric_precision', c.numeric_precision,
                        'numeric_scale', c.numeric_scale
                    )
                )
                FROM information_schema.columns c
                WHERE c.table_schema = t.table_schema 
                  AND c.table_name = t.table_name
                ORDER BY c.ordinal_position
            )
        )
    FROM information_schema.tables t
    WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime')
      AND t.table_type = 'BASE TABLE';

    -- Return views
    RETURN QUERY
    SELECT 
        v.table_schema::TEXT,
        'view'::TEXT,
        v.table_name::TEXT,
        v.view_definition::TEXT,
        jsonb_build_object(
            'is_updatable', v.is_updatable,
            'check_option', v.check_option
        )
    FROM information_schema.views v
    WHERE v.table_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime');

    -- Return functions with definitions
    RETURN QUERY
    SELECT 
        r.routine_schema::TEXT,
        'function'::TEXT,
        r.routine_name::TEXT,
        COALESCE(pg_get_functiondef(p.oid), r.routine_definition)::TEXT,
        jsonb_build_object(
            'routine_type', r.routine_type,
            'data_type', r.data_type,
            'external_language', r.external_language,
            'is_deterministic', r.is_deterministic,
            'security_type', r.security_type,
            'function_arguments', pg_get_function_arguments(p.oid),
            'return_type', pg_get_function_result(p.oid)
        )
    FROM information_schema.routines r
    LEFT JOIN pg_proc p ON p.proname = r.routine_name
    LEFT JOIN pg_namespace n ON n.oid = p.pronamespace AND n.nspname = r.routine_schema
    WHERE r.routine_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime')
      AND r.routine_type = 'FUNCTION';

END;
$$;

-- Create function to get RLS policies
CREATE OR REPLACE FUNCTION get_rls_policies()
RETURNS TABLE(
    schema_name TEXT,
    table_name TEXT,
    policy_name TEXT,
    policy_definition TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.schemaname::TEXT,
        p.tablename::TEXT,
        p.policyname::TEXT,
        pg_get_policydef(pol.oid)::TEXT,
        jsonb_build_object(
            'permissive', p.permissive,
            'roles', p.roles,
            'cmd', p.cmd,
            'qual', p.qual,
            'with_check', p.with_check
        )
    FROM pg_policies p
    LEFT JOIN pg_policy pol ON pol.polname = p.policyname
    WHERE p.schemaname NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime');
END;
$$;

-- Create function to get triggers
CREATE OR REPLACE FUNCTION get_triggers()
RETURNS TABLE(
    schema_name TEXT,
    table_name TEXT,
    trigger_name TEXT,
    trigger_definition TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.trigger_schema::TEXT,
        t.event_object_table::TEXT,
        t.trigger_name::TEXT,
        pg_get_triggerdef(tr.oid)::TEXT,
        jsonb_build_object(
            'event_manipulation', t.event_manipulation,
            'action_timing', t.action_timing,
            'action_orientation', t.action_orientation,
            'action_statement', t.action_statement,
            'action_condition', t.action_condition
        )
    FROM information_schema.triggers t
    LEFT JOIN pg_trigger tr ON tr.tgname = t.trigger_name
    WHERE t.trigger_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime');
END;
$$;

-- Create function to get indexes
CREATE OR REPLACE FUNCTION get_indexes()
RETURNS TABLE(
    schema_name TEXT,
    table_name TEXT,
    index_name TEXT,
    index_definition TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pi.schemaname::TEXT,
        pi.tablename::TEXT,
        pi.indexname::TEXT,
        pi.indexdef::TEXT,
        jsonb_build_object(
            'is_unique', idx.indisunique,
            'is_primary', idx.indisprimary,
            'columns', array_to_string(idx.indkey::int[], ',')
        )
    FROM pg_indexes pi
    LEFT JOIN pg_index idx ON idx.indexrelid = (
        SELECT oid FROM pg_class WHERE relname = pi.indexname
    )
    WHERE pi.schemaname NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime')
      AND NOT pi.indexname LIKE 'pg_%';
END;
$$;

-- Create function to get sequences
CREATE OR REPLACE FUNCTION get_sequences()
RETURNS TABLE(
    schema_name TEXT,
    sequence_name TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.sequence_schema::TEXT,
        s.sequence_name::TEXT,
        jsonb_build_object(
            'data_type', s.data_type,
            'start_value', s.start_value,
            'minimum_value', s.minimum_value,
            'maximum_value', s.maximum_value,
            'increment', s.increment,
            'cycle_option', s.cycle_option
        )
    FROM information_schema.sequences s
    WHERE s.sequence_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime');
END;
$$;

-- Create function to get constraints
CREATE OR REPLACE FUNCTION get_constraints()
RETURNS TABLE(
    schema_name TEXT,
    table_name TEXT,
    constraint_name TEXT,
    constraint_definition TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.table_schema::TEXT,
        tc.table_name::TEXT,
        tc.constraint_name::TEXT,
        pg_get_constraintdef(c.oid)::TEXT,
        jsonb_build_object(
            'constraint_type', tc.constraint_type,
            'is_deferrable', tc.is_deferrable,
            'initially_deferred', tc.initially_deferred,
            'column_names', (
                SELECT array_agg(kcu.column_name ORDER BY kcu.ordinal_position)
                FROM information_schema.key_column_usage kcu
                WHERE kcu.constraint_name = tc.constraint_name
                  AND kcu.table_schema = tc.table_schema
                  AND kcu.table_name = tc.table_name
            )
        )
    FROM information_schema.table_constraints tc
    LEFT JOIN pg_constraint c ON c.conname = tc.constraint_name
    WHERE tc.table_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime');
END;
$$;

-- Create function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE(
    stat_name TEXT,
    stat_value TEXT,
    metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Table statistics
    RETURN QUERY
    SELECT 
        'table_count'::TEXT,
        count(*)::TEXT,
        jsonb_build_object('type', 'table_statistics')
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'auth', 'storage', 'realtime')
      AND table_type = 'BASE TABLE';

    -- Database size
    RETURN QUERY
    SELECT 
        'database_size'::TEXT,
        pg_size_pretty(pg_database_size(current_database()))::TEXT,
        jsonb_build_object('type', 'size_statistics');

    -- Version info
    RETURN QUERY
    SELECT 
        'postgresql_version'::TEXT,
        version()::TEXT,
        jsonb_build_object('type', 'version_info');

END;
$$;

-- Grant execute permissions to all functions
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO service_role;

GRANT EXECUTE ON FUNCTION get_complete_schema_info() TO authenticated;
GRANT EXECUTE ON FUNCTION get_complete_schema_info() TO anon;
GRANT EXECUTE ON FUNCTION get_complete_schema_info() TO service_role;

GRANT EXECUTE ON FUNCTION get_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION get_rls_policies() TO anon;
GRANT EXECUTE ON FUNCTION get_rls_policies() TO service_role;

GRANT EXECUTE ON FUNCTION get_triggers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_triggers() TO anon;
GRANT EXECUTE ON FUNCTION get_triggers() TO service_role;

GRANT EXECUTE ON FUNCTION get_indexes() TO authenticated;
GRANT EXECUTE ON FUNCTION get_indexes() TO anon;
GRANT EXECUTE ON FUNCTION get_indexes() TO service_role;

GRANT EXECUTE ON FUNCTION get_sequences() TO authenticated;
GRANT EXECUTE ON FUNCTION get_sequences() TO anon;
GRANT EXECUTE ON FUNCTION get_sequences() TO service_role;

GRANT EXECUTE ON FUNCTION get_constraints() TO authenticated;
GRANT EXECUTE ON FUNCTION get_constraints() TO anon;
GRANT EXECUTE ON FUNCTION get_constraints() TO service_role;

GRANT EXECUTE ON FUNCTION get_database_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_database_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_database_stats() TO service_role;

-- Test the setup
SELECT 'Setup completed successfully!' as status;

-- Test function execution
SELECT exec_sql('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ''public''');

-- Display available functions for backup
SELECT 
    routine_name,
    routine_type,
    external_language
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'exec_sql',
    'get_complete_schema_info',
    'get_rls_policies', 
    'get_triggers',
    'get_indexes',
    'get_sequences',
    'get_constraints',
    'get_database_stats'
  )
ORDER BY routine_name;