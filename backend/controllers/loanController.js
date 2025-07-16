// In backend/controllers/loanController.js
import store from '../database.js';

export const submitApplication = async (req, res) => {
    // Application submission started
    
    // We expect the entire Redux state to be sent in the request body
    const applicationData = req.body;

    // Get the userId from the authenticated user, or use null for anonymous submissions
    const userId = req.user ? req.user.id : null;
    // User authenticated for application submission

    if (!applicationData) {
        return res.status(400).json({ message: 'No application data received.' });
    }

    const session = store.openSession();
    try {
        const newApplication = {
            ...applicationData,
            userId: userId,           // Link the application to the user
            submittedAt: new Date(),  // Add a timestamp
            status: 'pending',        // Set an initial status
            '@metadata': {
                '@collection': 'Applications' // Explicitly save to the 'Applications' collection
            }
        };

        // Saving application to database

        await session.store(newApplication);
        await session.saveChanges();

        res.status(201).json({ 
            message: 'Application submitted successfully!', 
            applicationId: newApplication.id 
        });
    } catch (error) {
        console.error('Error in submitApplication:', error);
        res.status(500).json({ message: 'Server error while submitting application.', error: error.message });
    } finally {
        session.dispose();
    }
};