// Quick diagnostic script to help identify Finmate database structure
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function diagnoseFinmate() {
  console.log("🔍 Diagnosing Finmate Database Structure");
  console.log("=====================================");
  console.log(`📍 URL: ${SUPABASE_URL}`);
  
  // Test 1: Basic connection
  console.log("\n1️⃣ Testing basic connection...");
  try {
    const { error } = await supabase.rpc("version");
    if (error) {
      console.log(`   ⚠️  RPC version failed: ${error.message}`);
    } else {
      console.log("   ✅ RPC version works");
    }
  } catch (err) {
    console.log(`   ❌ RPC error: ${err.message}`);
  }

  // Test 2: Try common table names for financial apps
  console.log("\n2️⃣ Testing common financial app tables...");
  const financeTableNames = [
    'accounts', 'account', 'users', 'user', 'profiles', 'profile',
    'transactions', 'transaction', 'budgets', 'budget', 'categories', 'category',
    'expenses', 'expense', 'incomes', 'income', 'goals', 'goal',
    'banks', 'bank', 'cards', 'card', 'payments', 'payment',
    'subscriptions', 'subscription', 'bills', 'bill', 'finances', 'finance'
  ];

  const foundTables = [];
  
  for (const tableName of financeTableNames) {
    try {
      const { error } = await supabase.from(tableName).select("*").limit(0);
      if (!error) {
        foundTables.push(tableName);
        console.log(`   ✅ Found: ${tableName}`);
        
        // Get a sample row to understand structure
        try {
          const { data, error: sampleError } = await supabase.from(tableName).select("*").limit(1);
          if (!sampleError && data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log(`      Columns: ${columns.join(', ')}`);
          }
        } catch (err) {
          console.log(`      Could not get sample data`);
        }
      }
    } catch (err) {
      // Table doesn't exist
    }
  }

  // Test 3: Try OpenAPI discovery
  console.log("\n3️⃣ Testing OpenAPI discovery...");
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    });

    if (response.ok) {
      const spec = await response.json();
      console.log("   ✅ OpenAPI spec accessible");
      
      if (spec.definitions) {
        const tables = Object.keys(spec.definitions).filter(name => !name.startsWith('rpc_'));
        console.log(`   📊 Found ${tables.length} definitions:`, tables.join(', '));
      } else {
        console.log("   ⚠️  No definitions in OpenAPI spec");
      }
    } else {
      console.log(`   ❌ OpenAPI spec failed: ${response.status}`);
    }
  } catch (err) {
    console.log(`   ❌ OpenAPI error: ${err.message}`);
  }

  // Test 4: Try auth tables (should exist in every Supabase)
  console.log("\n4️⃣ Testing auth schema access...");
  try {
    const { error } = await supabase.from("auth.users").select("count").limit(0);
    if (error) {
      console.log(`   ⚠️  Auth users: ${error.message}`);
    } else {
      console.log("   ✅ Auth users accessible");
    }
  } catch (err) {
    console.log(`   ❌ Auth error: ${err.message}`);
  }

  // Summary
  console.log("\n📋 SUMMARY");
  console.log("===========");
  if (foundTables.length > 0) {
    console.log(`✅ Found ${foundTables.length} tables: ${foundTables.join(', ')}`);
    console.log(`💡 Run: node professional-supabase-backup.js --manual-tables=${foundTables.join(',')}`);
  } else {
    console.log("❌ No tables found automatically");
    console.log("💡 Solutions:");
    console.log("   1. Check if your Finmate database has any tables");
    console.log("   2. Run setup-optional.sql in Supabase SQL Editor");
    console.log("   3. Check your service role key permissions");
  }
}

diagnoseFinmate().catch(console.error);