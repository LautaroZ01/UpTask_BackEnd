import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
    content: string,
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

const noteSchema: Schema = new Schema({
    content: {
        type: String,
        require: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        require: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        require: true
    }
}, { timestamps: true })

const Note = mongoose.model<INote>('Note', noteSchema)
export default Note
