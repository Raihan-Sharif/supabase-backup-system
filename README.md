# 🚀 Complete Supabase Backup & Restore System

**The most comprehensive backup solution for Supabase databases** - backs up everything including tables, data, functions, triggers, RLS policies, indexes, and more!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Compatible-green)](https://supabase.com/)

## ✨ Features

### 🏗️ Complete Schema Backup

- ✅ **Tables** with proper data types and constraints
- ✅ **Views** and materialized views
- ✅ **Functions** and stored procedures
- ✅ **Triggers** and event handlers
- ✅ **RLS Policies** (Row Level Security)
- ✅ **Indexes** and constraints
- ✅ **Sequences** and auto-increment columns
- ✅ **Extensions** and custom types

### 💾 Comprehensive Data Backup

- ✅ **All table data** with configurable limits
- ✅ **Large table handling** with chunked processing
- ✅ **Data type preservation** (JSON, UUID, timestamps, etc.)
- ✅ **Progress tracking** for long operations
- ✅ **Error recovery** and partial backups

### 📄 Multiple Export Formats

- 🔄 **SQL Scripts** - Ready-to-run restore scripts
- 📊 **JSON Export** - Structured data for analysis
- 📈 **CSV Files** - Individual table exports for Excel/analysis
- 📋 **Documentation** - Comprehensive backup reports

### 🛡️ Production Ready

- ⚡ **Fast & Efficient** - Optimized for large databases
- 🔒 **Secure** - Uses service role keys safely
- 🌍 **Universal** - Works with any Supabase project
- 📈 **Scalable** - Handles databases of any size
- 🔄 **Reliable** - Comprehensive error handling

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

### 2. Configuration

Edit `.env` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Run Your First Backup

```bash
# Complete backup (schema + data)
npm run backup

# Or run directly
node backup.js
```

### 4. Restore Your Database

```bash
# In your target Supabase project SQL Editor:
# 1. Copy contents of 'complete-restore.sql'
# 2. Paste and execute
# 3. Your database is restored! ✅
```

## 📖 Usage Examples

### Basic Usage

```bash
# Complete backup with all features
npm run backup

# Schema only (no data)
npm run backup:schema

# Data only (no schema)
npm run backup:data

# Fast backup (limited rows)
npm run backup:fast
```

### Advanced Options

```bash
# Custom configurations
node backup.js --schema-only --no-csv     # Schema without CSV files
node backup.js --fast --sql-only          # Quick SQL-only backup
node backup.js --no-functions --no-policies  # Skip functions and policies
```

### Programmatic Usage

```javascript
const { CompleteSupabaseBackup } = require("./backup.js");

// Custom backup configuration
const backup = new CompleteSupabaseBackup({
  includeData: true,
  maxRowsPerTable: 10000,
  exportFormats: ["sql", "json"],
});

// Run backup
const results = await backup.run();
console.log(`Backed up ${results.statistics.totalTables} tables`);
```

## 📁 Output Structure

```
supabase-backup/
└── 2024-01-15T10-30-45/
    ├── complete-restore.sql      # 🔄 Full database restore script
    ├── schema-only.sql           # 🏗️ Schema without data
    ├── complete-backup.json      # 📊 Complete backup data
    ├── backup-summary.json       # 📈 Statistics and reports
    ├── README.md                 # 📖 Backup documentation
    └── csv-data/                 # 📁 Individual table CSVs
        ├── users.csv
        ├── posts.csv
        ├── projects.csv
        └── ...
```

## 🔄 Restore Options

### Option 1: Complete Restore (Recommended)

1. Create new Supabase project
2. Open Supabase SQL Editor
3. Copy/paste `complete-restore.sql`
4. Execute script
5. ✅ Database fully restored!

### Option 2: Schema + Data Separately

1. Run `schema-only.sql` first
2. Import data using CSV files or JSON
3. Verify functionality

### Option 3: Selective Restore

1. Extract specific tables from SQL script
2. Use individual CSV files
3. Custom restoration process

## ⚙️ Configuration Options

```javascript
const BACKUP_CONFIG = {
  // Schema objects
  includeTables: true, // Backup table structures
  includeViews: true, // Backup views
  includeFunctions: true, // Backup functions
  includeTriggers: true, // Backup triggers
  includePolicies: true, // Backup RLS policies
  includeIndexes: true, // Backup indexes
  includeSequences: true, // Backup sequences

  // Data options
  includeData: true, // Include table data
  maxRowsPerTable: 100000, // Row limit per table
  maxTableSizeMB: 500, // Size limit per table

  // Export formats
  exportFormats: ["sql", "json", "csv"],

  // System tables to exclude
  excludeDataTables: ["auth.users", "auth.sessions", "storage.objects"],
};
```

## 🛠️ Advanced Features

### Large Database Support

- **Chunked processing** for tables with millions of rows
- **Memory optimization** prevents crashes on large datasets
- **Progress tracking** shows real-time backup status
- **Selective backup** with table inclusion/exclusion

### Error Handling & Recovery

- **Graceful error handling** continues backup on table failures
- **Detailed error reporting** with specific error messages
- **Partial backup support** saves what's accessible
- **Retry mechanisms** for transient failures

### Security & Performance

- **Service role authentication** for full database access
- **Connection pooling** for efficient database queries
- **Rate limiting** prevents overwhelming the database
- **Safe defaults** exclude sensitive system tables

## 📊 What Gets Backed Up

### ✅ Schema Objects

| Object Type  | Included | Notes                              |
| ------------ | -------- | ---------------------------------- |
| Tables       | ✅       | Complete structure with data types |
| Views        | ✅       | Including materialized views       |
| Functions    | ✅       | PostgreSQL/PL/pgSQL functions      |
| Triggers     | ✅       | Table triggers and event handlers  |
| RLS Policies | ✅       | Row Level Security policies        |
| Indexes      | ✅       | All indexes except system indexes  |
| Sequences    | ✅       | Auto-increment sequences           |
| Constraints  | ✅       | Primary keys, foreign keys, checks |
| Extensions   | ✅       | Custom PostgreSQL extensions       |

### ✅ Data

- **All table data** with configurable row limits
- **Proper data type handling** (JSON, UUID, timestamps)
- **Large object support** with chunked processing
- **Referential integrity** maintained in restore order

## 🔧 Development Setup

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Supabase project with service role key
- Git (for version control)

### Local Development

```bash
# Clone repository
git clone https://github.com/Raihan-Sharif/supabase-backup-system.git
cd supabase-backup-system

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your Supabase credentials in .env
# Run development backup
npm run dev
```

### Testing

```bash
# Test backup functionality
npm test

# Test with different configurations
npm run test:schema
npm run test:data
npm run test:large
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Test with real Supabase databases

## 📋 FAQ

### Q: Does this work with all Supabase plans?

A: Yes! Works with Free, Pro, and Enterprise plans. Only requires service role key.

### Q: Can I backup only specific tables?

A: Yes, modify the `excludeDataTables` configuration or create custom scripts.

### Q: How large databases can this handle?

A: Tested with databases up to 10GB+. Uses chunked processing for large tables.

### Q: Is this safe for production databases?

A: Yes, uses read-only operations. No data is modified during backup.

### Q: Can I schedule automated backups?

A: Yes, use cron jobs, GitHub Actions, or cloud schedulers with this script.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing database platform
- [PostgreSQL](https://www.postgresql.org/) for the robust database engine
- Contributors and testers who helped improve this tool

## 📧 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Raihan-Sharif/supabase-backup-system/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Raihan-Sharif/supabase-backup-system/discussions)
- 📖 **Documentation**: Check the generated README.md in backup folders
- 💬 **Community**: Join our discussions for help and tips

---

**Made with ❤️ for the Supabase community**

⭐ **Star this repo if it helped you!** ⭐
