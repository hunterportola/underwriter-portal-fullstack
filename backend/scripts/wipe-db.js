import { DocumentStore, DeleteByQueryOperation } from 'ravendb';
import 'dotenv/config';

const wipeDatabase = async (dbName) => {
    const store = new DocumentStore(process.env.RAVENDB_URL || 'http://127.0.0.1:8080', dbName);
    store.initialize();

    try {
        console.log(`Connecting to ${dbName}...`);
        const operation = await store.operations.send(new DeleteByQueryOperation('from @all_docs'));
        console.log(`Waiting for completion of delete operation in ${dbName}...`);
        await operation.waitForCompletion();
        console.log(`Successfully wiped all data from ${dbName}.`);
    } catch (error) {
        console.error(`Error wiping database ${dbName}:`, error);
    } finally {
        store.dispose();
    }
};

const run = async () => {
    await wipeDatabase('Applicants');
    await wipeDatabase('BorrowerPortal');
};

run();
