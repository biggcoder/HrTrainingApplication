import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    intern: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateId: { type: String, required: true, unique: true },
    fileUrl: { type: String } // URL to a generated PDF or image
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;