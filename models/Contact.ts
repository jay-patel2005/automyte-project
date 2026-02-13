import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    fullName: string;
    companyName?: string;
    email: string;
    projectType?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please provide your full name'],
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        companyName: {
            type: String,
            maxlength: [200, 'Company name cannot be more than 200 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        projectType: {
            type: String,
        },
        message: {
            type: String,
            required: [true, 'Please provide a message'],
            maxlength: [2000, 'Message cannot be more than 2000 characters'],
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
