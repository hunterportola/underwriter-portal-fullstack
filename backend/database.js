// In backend/database.js
import ravendb from 'ravendb';

// Destructure DocumentStore from the imported module
const { DocumentStore } = ravendb;

const store = new DocumentStore(
    process.env.RAVENDB_URL || 'http://127.0.0.1:8080', 
    process.env.RAVENDB_DATABASE || 'SharedUsers'
);
store.initialize();

console.log(`RavenDB store initialized for database: ${process.env.RAVENDB_DATABASE || 'SharedUsers'} at ${process.env.RAVENDB_URL || 'http://127.0.0.1:8080'}`);

export default store;