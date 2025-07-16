// Environment variable validation
import { config } from 'dotenv';

// Load environment variables
config();

const requiredEnvVars = [
    'JWT_SECRET'
];

const optionalEnvVars = {
    'PORT': '3002',
    'NODE_ENV': 'development',
    'RAVENDB_URL': 'http://127.0.0.1:8080',
    'RAVENDB_DATABASE': 'Applicants',
    'FRONTEND_URL': 'http://localhost:5173'
};

export function validateEnvironment() {
    const missing = [];
    
    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(var_ => console.error(`   - ${var_}`));
        console.error('\n💡 Please create a .env file with the required variables.');
        console.error('   See .env.example for reference.');
        process.exit(1);
    }
    
    // Set defaults for optional variables
    for (const [envVar, defaultValue] of Object.entries(optionalEnvVars)) {
        if (!process.env[envVar]) {
            process.env[envVar] = defaultValue;
            console.log(`⚠️  Using default value for ${envVar}: ${defaultValue}`);
        }
    }
    
    // Validate JWT_SECRET strength in production
    if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
        console.error('❌ JWT_SECRET must be at least 32 characters in production');
        process.exit(1);
    }
    
    console.log('✅ Environment validation passed');
}