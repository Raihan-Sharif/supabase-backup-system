# 🚀 Professional Supabase Backup & Restore System v2.0

**The most comprehensive, production-ready backup solution for Supabase databases** - now with complete function definitions, enhanced schema extraction, and professional-grade reliability.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Compatible-green)](https://supabase.com/)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/Raihan-Sharif/supabase-backup-system)

## ✨ What's New in v2.0

### 🔧 Complete Function Extraction

- ✅ **Full function code** with complete CREATE FUNCTION statements
- ✅ **Function bodies** extracted with proper syntax
- ✅ **Arguments and return types** preserved
- ✅ **Comments and metadata** included

### 🏗️ Enhanced Schema Coverage

- ✅ **Views** with complete definitions
- ✅ **Triggers** with full action statements
- ✅ **Constraints** with proper relationships
- ✅ **Sequences** with current values
- ✅ **Indexes** with complete definitions
- ✅ **RLS Policies** with exact conditions

### 💼 Professional Features

- ✅ **Progress tracking** with detailed statistics
- ✅ **Error handling** and recovery mechanisms
- ✅ **Multiple restore options** (complete, schema-only, data-only)
- ✅ **Comprehensive logging** and reporting
- ✅ **Production-ready** with performance optimizations

## 📊 Complete Backup Coverage

| Component    | v1.0          | v2.0 Pro             | Description                        |
| ------------ | ------------- | -------------------- | ---------------------------------- |
| Tables       | ✅            | ✅                   | Complete structure with data types |
| Data         | ✅            | ✅                   | All rows with chunked processing   |
| Functions    | ⚠️ Names only | ✅ **Complete code** | Full CREATE statements with bodies |
| Views        | ❌            | ✅                   | Complete view definitions          |
| Triggers     | ❌            | ✅                   | Full trigger statements            |
| RLS Policies | ⚠️ Basic      | ✅ **Complete**      | Exact policy conditions            |
| Indexes      | ❌            | ✅                   | All indexes with definitions       |
| Sequences    | ❌            | ✅                   | Sequences with current values      |
| Constraints  | ❌            | ✅                   | Foreign keys, checks, unique       |

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Raihan-Sharif/supabase-backup-system.git
cd supabase-backup-system

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Database Setup (Important!)

Run this SQL in your Supabase SQL Editor to enable complete schema extraction:

```sql
-- Copy and run the contents of enhanced-supabase-setup.sql
-- This enables function definition extraction and enhanced schema analysis
```

### 3. Configuration

Edit `.env` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Your First Professional Backup

```bash
# Complete professional backup
npm run backup

# Or run directly
node professional-supabase-backup.js
```

## 📖 Usage Guide

### Basic Commands

```bash
# Complete backup (recommended)
npm run backup:complete

# Schema only with full function code
npm run backup:schema

# Data only
npm run backup:data

# Fast backup for development
npm run backup:fast

# SQL files only
npm run backup:sql
```

### Advanced Options

```bash
# Custom configurations
node professional-supabase-backup.js --schema-only --no-csv
node professional-supabase-backup.js --fast --sql-only
node professional-supabase-backup.js --no-functions --no-policies
```

### Environment-Specific Backups

```bash
# Production backup
npm run backup:production

# Staging backup (faster)
npm run backup:staging

# Development backup (minimal)
npm run backup:development
```

### Scheduled Backups

```bash
# Daily backup (no CSV for speed)
npm run schedule:daily

# Weekly complete backup
npm run schedule:weekly

# Monthly schema backup
npm run schedule:monthly
```

## 📁 Professional Output Structure

```
supabase-backup/
└── 2024-01-15T10-30-45/
    ├── complete-restore.sql      # 🔄 Complete database restore
    ├── schema-only.sql           # 🏗️ Schema with full function code
    ├── data-only.sql             # 💾 Data-only restore
    ├── complete-backup.json      # 📊 Complete backup with metadata
    ├── backup-summary.json       # 📈 Professional statistics
    ├── README.md                 # 📖 Comprehensive documentation
    └── csv-data/                 # 📁 Individual table CSVs
        ├── users.csv
        ├── posts.csv
        └── ...
```

## 🔄 Professional Restore Options

### Option 1: Complete Restore (Recommended)

```sql
-- In Supabase SQL Editor:
-- 1. Copy complete-restore.sql contents
-- 2. Execute the script
-- 3. ✅ Everything restored with full function code!
```

### Option 2: Staged Restore

```sql
-- 1. Execute schema-only.sql first
-- 2. Execute data-only.sql second
-- 3. Verify functions and triggers
```

### Option 3: Selective Restore

- Extract specific sections from SQL files
- Use individual CSV files for specific tables
- Restore only needed functions or policies

## ⚙️ Professional Configuration

```javascript
const BACKUP_CONFIG = {
  // Enhanced schema extraction
  includeFunctions: true, // Full function code
  includeViews: true, // Complete view definitions
  includeTriggers: true, // Full trigger statements
  includePolicies: true, // Complete RLS policies
  includeIndexes: true, // All indexes
  includeSequences: true, // Sequences with values
  includeConstraints: true, // Foreign keys, checks

  // Professional data handling
  maxRowsPerTable: 100000, // Configurable limits
  queryTimeout: 30000, // 30-second timeout
  chunkSize: 1000, // Batch processing

  // Multiple output formats
  exportFormats: ["sql", "json", "csv"],

  // Production options
  createRestoreScript: true,
  includeDropStatements: true,
  generateReadme: true,
  compressOutput: false,
};
```

## 🛠️ Advanced Features

### Complete Function Extraction

The system now extracts full function definitions with:

```sql
-- Example of extracted function
CREATE OR REPLACE FUNCTION "public"."increment_post_view"(post_id INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO post_views (post_id, view_date, view_count)
    VALUES (post_id, CURRENT_DATE, 1)
    ON CONFLICT (post_id, view_date)
    DO UPDATE SET view_count = post_views.view_count + 1;
END;
$function$;
```

### Enhanced Schema Analysis

- **Table structures** with complete column metadata
- **Views** with full SQL definitions
- **Triggers** with complete action statements
- **RLS policies** with exact conditions
- **Indexes** with performance characteristics
- **Constraints** with relationship mappings

### Professional Error Handling

- **Graceful degradation** when permissions are limited
- **Detailed error reporting** with context
- **Fallback mechanisms** for restricted environments
- **Progress tracking** with real-time updates

## 📊 Performance & Statistics

The professional system provides comprehensive metrics:

```json
{
  "statistics": {
    "totalSchemas": 2,
    "totalTables": 25,
    "totalViews": 3,
    "totalFunctions": 18,
    "totalTriggers": 5,
    "totalPolicies": 25,
    "totalIndexes": 45,
    "totalSequences": 8,
    "totalRows": 50000,
    "backupDuration": 45000,
    "errorRate": 0
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Function extraction fails**

   ```bash
   # Ensure enhanced-supabase-setup.sql is executed
   # Check service role permissions
   ```

2. **Schema access denied**

   ```bash
   # The system falls back to REST API discovery
   # Some features may be limited
   ```

3. **Large database timeouts**
   ```bash
   # Use --fast flag for development
   # Increase queryTimeout in config
   ```

### Function Extraction Requirements

For complete function extraction, run the setup SQL:

```sql
-- This creates the exec_sql function and schema extraction helpers
-- Required for professional-grade backup capabilities
```

## 🚦 Migration from v1.0

### Breaking Changes

- New file structure with professional naming
- Enhanced configuration options
- Additional dependencies for schema extraction

### Migration Steps

1. **Backup existing data** with v1.0
2. **Install v2.0** professional system
3. **Run setup SQL** in Supabase
4. **Configure new options** as needed
5. **Test restore** on development database

## 📈 Production Deployment

### Docker Usage

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "backup:production"]
```

### GitHub Actions

```yaml
name: Daily Supabase Backup
on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "16"
      - run: npm install
      - run: npm run backup:production
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

### Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: supabase-backup
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: supabase-backup-system:latest
              command: ["npm", "run", "backup:production"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

### Development Setup

```bash
git clone https://github.com/Raihan-Sharif/supabase-backup-system.git
cd supabase-backup-system
npm install
npm run dev
```

### Testing

```bash
npm run test:schema     # Test schema extraction
npm run test:data       # Test data backup
npm run test:functions  # Test function extraction
```

## 📋 Roadmap

### v2.1 (Coming Soon)

- [ ] **Incremental backups** with change detection
- [ ] **Compression support** for large databases
- [ ] **Cloud storage integration** (AWS S3, Google Cloud)
- [ ] **Backup verification** and integrity checks

### v2.2 (Future)

- [ ] **Real-time sync** capabilities
- [ ] **Web dashboard** for backup management
- [ ] **Multi-database** backup orchestration
- [ ] **Advanced scheduling** with conflict detection

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing database platform
- [PostgreSQL](https://www.postgresql.org/) for the robust database engine
- The open-source community for contributions and feedback

## 📧 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Raihan-Sharif/supabase-backup-system/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Raihan-Sharif/supabase-backup-system/discussions)
- 📖 **Documentation**: Check generated README.md in backup folders
- 💬 **Community**: Join our discussions for help and tips

---

**Professional Supabase Backup System v2.0**  
**Made with ❤️ for the Supabase community**

⭐ **Star this repo if it helps your production workflow!** ⭐
