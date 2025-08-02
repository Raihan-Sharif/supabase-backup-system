#!/usr/bin/env node

// supabase-backup-cli.js
// Professional CLI wrapper for Supabase Backup System
// Provides user-friendly interface with validation and guidance

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// CLI Colors
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) =>
    console.log(`${colors.bright}${colors.cyan}🚀 ${msg}${colors.reset}`),
  subtitle: (msg) => console.log(`${colors.magenta}${msg}${colors.reset}`),
};

class SupabaseBackupCLI {
  constructor() {
    this.args = process.argv.slice(2);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async run() {
    try {
      this.displayHeader();

      const command = this.args[0];

      switch (command) {
        case "setup":
          await this.setup();
          break;
        case "backup":
          await this.backup();
          break;
        case "restore":
          await this.restore();
          break;
        case "status":
          await this.status();
          break;
        case "clean":
          await this.clean();
          break;
        case "schedule":
          await this.schedule();
          break;
        case "validate":
          await this.validate();
          break;
        case "help":
        case undefined:
          this.showHelp();
          break;
        default:
          log.error(`Unknown command: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      log.error(`CLI Error: ${error.message}`);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  displayHeader() {
    console.log(`
${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════════╗
║                PROFESSIONAL SUPABASE BACKUP CLI v2.0          ║
║                Complete Database Backup & Restore             ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}
`);
  }

  async setup() {
    log.title("Setting up Professional Supabase Backup");

    // Check if .env exists
    if (!fs.existsSync(".env")) {
      log.info("Creating .env file from template...");
      if (fs.existsSync(".env.example")) {
        fs.copyFileSync(".env.example", ".env");
        log.success(".env file created");
      } else {
        log.warning(".env.example not found, creating basic .env");
        this.createBasicEnv();
      }
    } else {
      log.warning(".env file already exists");
    }

    // Interactive configuration
    await this.interactiveSetup();

    // Validate setup
    await this.validateEnvironment();

    // Check database setup
    await this.checkDatabaseSetup();

    log.success("Setup completed! You can now run: supabase-backup-cli backup");
  }

  async interactiveSetup() {
    log.subtitle("\n📝 Interactive Configuration");

    const supabaseUrl = await this.question(
      "Enter your Supabase URL (https://xxx.supabase.co): "
    );
    const serviceKey = await this.question("Enter your service role key: ");

    if (supabaseUrl && serviceKey) {
      let envContent = fs.readFileSync(".env", "utf8");
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_URL=.*/,
        `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`
      );
      envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*/,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
      );
      fs.writeFileSync(".env", envContent);
      log.success("Configuration saved to .env");
    }
  }

  async backup() {
    log.title("Starting Professional Backup");

    // Validate environment
    if (!(await this.validateEnvironment())) {
      log.error(
        "Environment validation failed. Run: supabase-backup-cli setup"
      );
      return;
    }

    // Build backup command
    const backupArgs = this.args.slice(1);
    let command = "node professional-supabase-backup.js";

    if (backupArgs.length > 0) {
      command += " " + backupArgs.join(" ");
    } else {
      // Interactive mode
      const mode = await this.selectBackupMode();
      command += " " + mode;
    }

    log.info(`Executing: ${command}`);

    try {
      // Run backup with real-time output
      const child = spawn(
        "node",
        ["professional-supabase-backup.js", ...backupArgs],
        {
          stdio: "inherit",
          shell: true,
        }
      );

      child.on("close", (code) => {
        if (code === 0) {
          log.success("Backup completed successfully!");
          this.showBackupSummary();
        } else {
          log.error(`Backup failed with code ${code}`);
        }
      });
    } catch (error) {
      log.error(`Backup execution failed: ${error.message}`);
    }
  }

  async selectBackupMode() {
    log.subtitle("\n🎯 Select Backup Mode:");
    console.log("1. Complete backup (schema + data + functions) - Recommended");
    console.log("2. Schema only (with complete function code)");
    console.log("3. Data only");
    console.log("4. Fast backup (development)");
    console.log("5. SQL only (no CSV files)");

    const choice = await this.question("\nEnter your choice (1-5): ");

    switch (choice) {
      case "1":
        return "";
      case "2":
        return "--schema-only";
      case "3":
        return "--data-only";
      case "4":
        return "--fast";
      case "5":
        return "--sql-only";
      default:
        log.warning("Invalid choice, using complete backup");
        return "";
    }
  }

  async restore() {
    log.title("Restore Guide");

    const backupDirs = this.getBackupDirectories();

    if (backupDirs.length === 0) {
      log.warning(
        "No backups found. Create a backup first with: supabase-backup-cli backup"
      );
      return;
    }

    log.subtitle("\n📁 Available Backups:");
    backupDirs.forEach((dir, index) => {
      const stats = this.getBackupStats(dir);
      console.log(
        `${index + 1}. ${dir} (${stats.tables} tables, ${stats.rows} rows)`
      );
    });

    const choice = await this.question("\nSelect backup to restore (number): ");
    const selectedBackup = backupDirs[parseInt(choice) - 1];

    if (!selectedBackup) {
      log.error("Invalid selection");
      return;
    }

    const backupPath = path.join("supabase-backup", selectedBackup);
    const restoreFile = path.join(backupPath, "complete-restore.sql");

    if (!fs.existsSync(restoreFile)) {
      log.error("Restore file not found in selected backup");
      return;
    }

    log.subtitle("\n🔄 Restore Instructions:");
    console.log("1. Open your target Supabase project dashboard");
    console.log("2. Go to SQL Editor");
    console.log("3. Copy and paste the contents of:");
    console.log(`   ${colors.bright}${restoreFile}${colors.reset}`);
    console.log("4. Execute the script");
    console.log("5. Your database will be fully restored!");

    const openFile = await this.question("\nOpen restore file now? (y/n): ");
    if (openFile.toLowerCase() === "y") {
      try {
        const content = fs.readFileSync(restoreFile, "utf8");
        console.log("\n" + "=".repeat(80));
        console.log("SQL RESTORE SCRIPT CONTENT:");
        console.log("=".repeat(80));
        console.log(
          content.substring(0, 2000) +
            "...\n[Content truncated - copy full file]"
        );
        console.log("=".repeat(80));
      } catch (error) {
        log.error(`Error reading restore file: ${error.message}`);
      }
    }
  }

  async status() {
    log.title("Backup System Status");

    // Environment status
    log.subtitle("\n🔧 Environment:");
    const envStatus = await this.validateEnvironment(false);
    console.log(`   Configuration: ${envStatus ? "✅ Valid" : "❌ Invalid"}`);

    // Database connection
    log.subtitle("\n🗄️  Database:");
    try {
      require("dotenv").config();
      const { createClient } = require("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.SUPABASE_SERVICE_KEY
      );

      const { data, error } = await supabase.rpc("version");
      console.log(`   Connection: ${error ? "❌ Failed" : "✅ Connected"}`);
      if (error) console.log(`   Error: ${error.message}`);
    } catch (err) {
      console.log(`   Connection: ❌ Failed (${err.message})`);
    }

    // Backup history
    log.subtitle("\n📊 Backup History:");
    const backupDirs = this.getBackupDirectories();
    console.log(`   Total backups: ${backupDirs.length}`);

    if (backupDirs.length > 0) {
      console.log(`   Latest: ${backupDirs[0]}`);
      const stats = this.getBackupStats(backupDirs[0]);
      console.log(
        `   Tables: ${stats.tables}, Rows: ${stats.rows}, Size: ${stats.size}`
      );
    }

    // Disk usage
    log.subtitle("\n💾 Disk Usage:");
    const totalSize = this.calculateBackupSize();
    console.log(`   Backup directory size: ${totalSize}`);
  }

  async clean() {
    log.title("Cleaning Backup Directory");

    const backupDirs = this.getBackupDirectories();

    if (backupDirs.length === 0) {
      log.info("No backups to clean");
      return;
    }

    log.subtitle(`\n📁 Found ${backupDirs.length} backups`);

    const options = [
      "Remove backups older than 7 days",
      "Remove backups older than 30 days",
      "Remove all backups except latest 5",
      "Remove all backups (dangerous!)",
      "Cancel",
    ];

    options.forEach((option, index) => {
      console.log(`${index + 1}. ${option}`);
    });

    const choice = await this.question("\nSelect cleaning option: ");

    switch (choice) {
      case "1":
        await this.cleanOldBackups(7);
        break;
      case "2":
        await this.cleanOldBackups(30);
        break;
      case "3":
        await this.keepLatestBackups(5);
        break;
      case "4":
        await this.removeAllBackups();
        break;
      case "5":
        log.info("Cleaning cancelled");
        break;
      default:
        log.error("Invalid choice");
    }
  }

  async schedule() {
    log.title("Backup Scheduling");

    log.subtitle("\n⏰ Schedule Options:");
    console.log("1. Generate cron job commands");
    console.log("2. Generate Docker Compose for scheduled backups");
    console.log("3. Generate GitHub Actions workflow");
    console.log("4. Generate systemd timer");

    const choice = await this.question("\nSelect option: ");

    switch (choice) {
      case "1":
        this.generateCronCommands();
        break;
      case "2":
        this.generateDockerCompose();
        break;
      case "3":
        this.generateGitHubActions();
        break;
      case "4":
        this.generateSystemdTimer();
        break;
      default:
        log.error("Invalid choice");
    }
  }

  async validate() {
    log.title("System Validation");

    let allValid = true;

    // Environment validation
    log.subtitle("\n🔧 Environment Validation:");
    const envValid = await this.validateEnvironment();
    allValid = allValid && envValid;

    // Dependencies validation
    log.subtitle("\n📦 Dependencies:");
    try {
      require("@supabase/supabase-js");
      log.success("Supabase client available");
    } catch (error) {
      log.error("Supabase client not found. Run: npm install");
      allValid = false;
    }

    // Backup script validation
    log.subtitle("\n📄 Backup Script:");
    if (fs.existsSync("professional-supabase-backup.js")) {
      log.success("Professional backup script found");
    } else {
      log.error("professional-supabase-backup.js not found");
      allValid = false;
    }

    // Setup SQL validation
    log.subtitle("\n🗄️  Database Setup:");
    await this.checkDatabaseSetup();

    if (allValid) {
      log.success("\n✅ All validations passed! System ready for backup.");
    } else {
      log.error("\n❌ Some validations failed. Check the issues above.");
    }
  }

  // Helper methods
  async validateEnvironment(showLogs = true) {
    require("dotenv").config();

    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      if (showLogs) {
        log.error("Missing environment variables");
        console.log(
          "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
        );
        console.log("Run: supabase-backup-cli setup");
      }
      return false;
    }

    if (showLogs) {
      log.success("Environment variables configured");
    }
    return true;
  }

  async checkDatabaseSetup() {
    try {
      require("dotenv").config();
      const { createClient } = require("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.SUPABASE_SERVICE_KEY
      );

      const { data, error } = await supabase.rpc("exec_sql", {
        query: "SELECT 1 as test",
      });

      if (error) {
        log.warning("exec_sql function not found - limited schema extraction");
        console.log(
          "   Run enhanced-supabase-setup.sql in your Supabase SQL Editor"
        );
        console.log("   This enables complete function definition extraction");
        return false;
      } else {
        log.success(
          "Database setup complete - full schema extraction available"
        );
        return true;
      }
    } catch (error) {
      log.error(`Database check failed: ${error.message}`);
      return false;
    }
  }

  getBackupDirectories() {
    const backupDir = "supabase-backup";
    if (!fs.existsSync(backupDir)) return [];

    return fs
      .readdirSync(backupDir)
      .filter((item) => fs.statSync(path.join(backupDir, item)).isDirectory())
      .sort()
      .reverse(); // Latest first
  }

  getBackupStats(backupDir) {
    const summaryPath = path.join(
      "supabase-backup",
      backupDir,
      "backup-summary.json"
    );

    if (!fs.existsSync(summaryPath)) {
      return { tables: "Unknown", rows: "Unknown", size: "Unknown" };
    }

    try {
      const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
      return {
        tables: summary.statistics?.totalTables || "Unknown",
        rows: summary.statistics?.totalRows?.toLocaleString() || "Unknown",
        size: this.formatBytes(
          this.getDirectorySize(path.join("supabase-backup", backupDir))
        ),
      };
    } catch (error) {
      return { tables: "Error", rows: "Error", size: "Error" };
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;

    if (!fs.existsSync(dirPath)) return 0;

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        totalSize += this.getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }

    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  calculateBackupSize() {
    const backupDir = "supabase-backup";
    if (!fs.existsSync(backupDir)) return "0 Bytes";

    return this.formatBytes(this.getDirectorySize(backupDir));
  }

  async cleanOldBackups(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const backupDirs = this.getBackupDirectories();
    let removed = 0;

    for (const dir of backupDirs) {
      const dirPath = path.join("supabase-backup", dir);
      const stats = fs.statSync(dirPath);

      if (stats.mtime < cutoffDate) {
        const confirm = await this.question(`Remove backup ${dir}? (y/n): `);
        if (confirm.toLowerCase() === "y") {
          fs.rmSync(dirPath, { recursive: true, force: true });
          removed++;
          log.success(`Removed ${dir}`);
        }
      }
    }

    log.info(`Cleaned ${removed} old backups`);
  }

  async keepLatestBackups(count) {
    const backupDirs = this.getBackupDirectories();

    if (backupDirs.length <= count) {
      log.info(`Only ${backupDirs.length} backups found, nothing to remove`);
      return;
    }

    const toRemove = backupDirs.slice(count);

    log.warning(`This will remove ${toRemove.length} backups:`);
    toRemove.forEach((dir) => console.log(`  - ${dir}`));

    const confirm = await this.question("\nProceed? (y/n): ");
    if (confirm.toLowerCase() === "y") {
      for (const dir of toRemove) {
        fs.rmSync(path.join("supabase-backup", dir), {
          recursive: true,
          force: true,
        });
        log.success(`Removed ${dir}`);
      }
    }
  }

  createBasicEnv() {
    const content = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Environment
NODE_ENV=development
`;
    fs.writeFileSync(".env", content);
  }

  generateCronCommands() {
    log.subtitle("\n⏰ Cron Job Commands:");
    console.log("# Daily backup at 2 AM");
    console.log("0 2 * * * cd /path/to/backup && npm run backup:production");
    console.log("");
    console.log("# Weekly complete backup on Sunday at 3 AM");
    console.log("0 3 * * 0 cd /path/to/backup && npm run backup:complete");
    console.log("");
    console.log("# Monthly schema backup on 1st at 4 AM");
    console.log("0 4 1 * * cd /path/to/backup && npm run backup:schema");
  }

  generateDockerCompose() {
    const content = `version: '3.8'
services:
  supabase-backup:
    build: .
    environment:
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=\${SUPABASE_SERVICE_KEY}
    volumes:
      - ./backups:/app/supabase-backup
    command: npm run backup:production
    
  backup-scheduler:
    image: mcuadros/ofelia:latest
    depends_on:
      - supabase-backup
    command: daemon --docker
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    labels:
      ofelia.job-run.backup.schedule: "0 2 * * *"
      ofelia.job-run.backup.container: "supabase-backup"
`;

    log.subtitle("\n🐳 Docker Compose Configuration:");
    console.log(content);
  }

  generateGitHubActions() {
    const content = `name: Supabase Backup
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:     # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run backup
        run: npm run backup:production
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: \${{ secrets.SUPABASE_SERVICE_KEY }}
          
      - name: Upload backup artifacts
        uses: actions/upload-artifact@v3
        with:
          name: supabase-backup-\${{ github.run_number }}
          path: supabase-backup/
          retention-days: 30
`;

    log.subtitle("\n🔄 GitHub Actions Workflow:");
    console.log(content);
  }

  showBackupSummary() {
    const backupDirs = this.getBackupDirectories();
    if (backupDirs.length > 0) {
      const latest = backupDirs[0];
      const stats = this.getBackupStats(latest);

      log.subtitle("\n📊 Backup Summary:");
      console.log(`   Location: supabase-backup/${latest}`);
      console.log(`   Tables: ${stats.tables}`);
      console.log(`   Rows: ${stats.rows}`);
      console.log(`   Size: ${stats.size}`);
    }
  }

  showHelp() {
    console.log(`
${colors.bright}Professional Supabase Backup CLI v2.0${colors.reset}

${colors.cyan}USAGE:${colors.reset}
  supabase-backup-cli <command> [options]

${colors.cyan}COMMANDS:${colors.reset}
  ${colors.green}setup${colors.reset}      Set up the backup system with interactive configuration
  ${colors.green}backup${colors.reset}     Create a new backup (interactive mode if no options)
  ${colors.green}restore${colors.reset}    Show restore instructions for existing backups
  ${colors.green}status${colors.reset}     Display system status and backup history
  ${colors.green}clean${colors.reset}      Clean old backups with various options
  ${colors.green}schedule${colors.reset}   Generate scheduling configurations (cron, docker, etc.)
  ${colors.green}validate${colors.reset}   Validate system configuration and dependencies
  ${colors.green}help${colors.reset}       Show this help message

${colors.cyan}BACKUP OPTIONS:${colors.reset}
  supabase-backup-cli backup                    # Interactive mode
  supabase-backup-cli backup --schema-only     # Schema with complete functions
  supabase-backup-cli backup --data-only       # Data only
  supabase-backup-cli backup --fast            # Fast development backup
  supabase-backup-cli backup --sql-only        # No CSV files

${colors.cyan}EXAMPLES:${colors.reset}
  # First time setup
  supabase-backup-cli setup
  
  # Create complete backup
  supabase-backup-cli backup
  
  # Quick development backup  
  supabase-backup-cli backup --fast
  
  # Check system status
  supabase-backup-cli status
  
  # Clean old backups
  supabase-backup-cli clean

${colors.cyan}FEATURES:${colors.reset}
  ✅ Complete function code extraction
  ✅ Professional schema analysis
  ✅ Multiple restore options
  ✅ Interactive configuration
  ✅ Backup management tools
  ✅ Scheduling assistance

${colors.cyan}SUPPORT:${colors.reset}
  GitHub: https://github.com/Raihan-Sharif/professional-supabase-backup
  Issues: https://github.com/Raihan-Sharif/professional-supabase-backup/issues
`);
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Run CLI
if (require.main === module) {
  const cli = new SupabaseBackupCLI();
  cli.run().catch(console.error);
}

module.exports = { SupabaseBackupCLI };
