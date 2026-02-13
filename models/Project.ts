import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    category: string;
    image?: string;
    technologies?: string[];
    link?: string;
    status: 'active' | 'completed' | 'in-progress';
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a project title'],
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a project description'],
        },
        category: {
            type: String,
            required: [true, 'Please provide a project category'],
        },
        image: {
            type: String,
        },
        technologies: {
            type: [String],
            default: [],
        },
        link: {
            type: String,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'in-progress'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
