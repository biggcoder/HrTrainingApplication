import User from '../models/userModel.js';

// @desc    Get all users, with optional filtering by role
// @route   GET /api/users
// @access  Private/Admin

const getMyProfile = async (req, res, next) => {
    try {
        // We get req.user from the 'protect' middleware
        const user = await User.findById(req.user._id).populate('assignedInterns', 'name email');
        res.json(user);
    } catch (error) {
        next(error);
    }
};
const getUsers = async (req, res, next) => {
    try {
        const filter = req.query.role ? { role: req.query.role } : {};
        
        // Find users based on the filter
        const usersQuery = User.find(filter).select('-password');

        // If we are fetching interns, populate their assigned mentor's name
        if (req.query.role === 'Intern') {
            usersQuery.populate('mentor', 'name'); // 'name' means we only get the mentor's name field
        }

        const users = await usersQuery.exec();
        
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Assign a mentor to an intern
// @route   PUT /api/users/assign-mentor
// @access  Private/Admin
const assignMentor = async (req, res, next) => {
    const { internId, mentorId } = req.body;
    try {
        const intern = await User.findById(internId);
        const mentor = await User.findById(mentorId);

        if (!intern || intern.role !== 'Intern') {
            res.status(404);
            throw new Error('Intern not found.');
        }

        if (!mentor || mentor.role !== 'Mentor') {
            res.status(404);
            throw new Error('Mentor not found.');
        }

        // Assign mentor to intern
        intern.mentor = mentorId;
        await intern.save();

        // Add intern to mentor's list of assigned interns
        mentor.assignedInterns.push(internId);
        await mentor.save();

        res.json({ message: 'Mentor assigned successfully.' });

    } catch (error) {
        next(error);
    }
};

export { getUsers, assignMentor, getMyProfile };