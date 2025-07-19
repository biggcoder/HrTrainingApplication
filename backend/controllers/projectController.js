import Project from '../models/projectModel.js';
import User from '../models/userModel.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Mentor
const createProject = async (req, res, next) => {
    const { title, description, internId } = req.body;
    try {
        // Verify the intern is assigned to this mentor
        const intern = await User.findById(internId);
        if (!intern || !intern.mentor.equals(req.user._id)) {
            res.status(403);
            throw new Error('You can only assign projects to your own interns.');
        }

        const project = new Project({
            title,
            description,
            intern: internId,
            mentor: req.user._id, // The logged-in mentor
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        next(error);
    }
};

// @desc    Get projects based on user role
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
    try {
        let projects;
        if (req.user.role === 'Mentor') {
            // Mentor gets all projects they have assigned
            projects = await Project.find({ mentor: req.user._id }).populate('intern', 'name email');
        } else if (req.user.role === 'Intern') {
            // Intern gets only their own projects
            projects = await Project.find({ intern: req.user._id }).populate('mentor', 'name');
        } else if (req.user.role === 'Admin') {
            // Admin gets all projects
            projects = await Project.find({}).populate('intern', 'name').populate('mentor', 'name');
        } else {
            return res.json([]);
        }
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a project's status
// @route   PUT /api/projects/:id/status
// @access  Private/Mentor
const updateProjectStatus = async (req, res, next) => {
    const { status } = req.body;
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Ensure the logged-in user is the mentor for this project
        if (!project.mentor.equals(req.user._id)) {
            res.status(403);
            throw new Error('You are not authorized to update this project.');
        }

        project.status = status;
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
};
const submitWork = async (req, res, next) => {
    const { fileUrl, remarks } = req.body;
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Ensure the logged-in user is the assigned intern
        if (!project.intern.equals(req.user._id)) {
            res.status(403);
            throw new Error('You are not authorized to submit work for this project.');
        }

        // Create a new submission object
        const newSubmission = {
            fileUrl,
            remarks,
        };

        // Add to the front of the submissions array
        project.submissions.unshift(newSubmission);
        project.status = 'Submitted'; // Update project status

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        next(error);
    }
};


export { createProject, getProjects, updateProjectStatus ,submitWork};