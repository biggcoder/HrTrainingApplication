import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    remarks: { type: String },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['New', 'Assigned', 'Ongoing', 'Submitted', 'Completed', 'Rejected'],
        default: 'Assigned'
    },
    submissions: [submissionSchema],
    feedback: [{
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;