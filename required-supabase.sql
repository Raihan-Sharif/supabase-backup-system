-- Optional: Create exec_sql function for advanced schema queries
-- Run this in Supabase SQL Editor if you want enhanced schema information
-- (The main backup works fine without this)

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO service_role;

-- Test the function
SELECT exec_sql('SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'' LIMIT 5');