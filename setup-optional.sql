-- =============================================
-- OPTIONAL SETUP FOR ENHANCED FUNCTIONALITY
-- =============================================
-- This script creates the exec_sql function for enhanced backup functionality.
-- 
-- ⚠️  IMPORTANT: This is OPTIONAL!
-- The backup system works WITHOUT this function, but with limited schema access.
-- 
-- 🎯 What this enables:
-- ✅ Complete function definitions with full code
-- ✅ Enhanced view definitions
-- ✅ Complete trigger definitions
-- ✅ Detailed enum information
-- ✅ Comprehensive index definitions
-- ✅ Full constraint information
-- 
-- 🔒 Security Note:
-- This function allows executing arbitrary SQL. Only use with trusted applications.
-- Consider removing this function after backup if security is a concern.
-- 
-- =============================================

-- Create the exec_sql function (optional for enhanced functionality)
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rec record;
    result json[];
    query_result json;
BEGIN
    -- Execute the query and collect results
    FOR rec IN EXECUTE query LOOP
        result := array_append(result, row_to_json(rec));
    END LOOP;
    
    -- Return results as SETOF json
    query_result := json_build_object('result', result);
    RETURN NEXT query_result;
    
    RETURN;
END;
$$;

-- Grant execute permissions to service role
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- Add a comment
COMMENT ON FUNCTION exec_sql(text) IS 'Optional function for enhanced Supabase backup functionality. Allows professional backup tool to access complete schema information.';

-- =============================================
-- VERIFICATION
-- =============================================
-- Test the function (should return PostgreSQL version info)
SELECT exec_sql('SELECT version() as pg_version');

-- =============================================
-- REMOVAL INSTRUCTIONS (if needed later)
-- =============================================
-- To remove this function later for security:
-- DROP FUNCTION IF EXISTS exec_sql(text);
-- =============================================