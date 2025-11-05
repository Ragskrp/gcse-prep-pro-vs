const mongoose = require('mongoose');
const fs = require('fs');

const StudyMaterialSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    },
    originalName: { 
        type: String, 
        required: true 
    },
    fileType: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true,
        enum: ['maths', 'english', 'science', 'computerscience', 'french']
    },
    topic: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String,
        default: '' 
    },
    path: { 
        type: String, 
        required: true 
    },
    downloads: { 
        type: Number, 
        default: 0 
    },
    lastDownloaded: { 
        type: Date 
    }
}, {
    timestamps: true
});

// Delete associated file when document is removed
StudyMaterialSchema.pre('remove', function(next) {
    try {
        if (this.path && fs.existsSync(this.path)) {
            fs.unlinkSync(this.path);
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);