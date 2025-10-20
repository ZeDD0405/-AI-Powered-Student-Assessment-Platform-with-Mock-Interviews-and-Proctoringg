const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FormDataSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

// Hash password before saving
FormDataSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password during login
FormDataSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);

module.exports = FormDataModel;
