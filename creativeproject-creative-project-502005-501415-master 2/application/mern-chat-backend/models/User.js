const mongoose = require('mongoose');
// const {} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Can't be blank"]
    },
    password: {
        type: String,
        required: [true, "Can't be blank"]
    },
    newMessages:{
        type:Object,
        default:{}
    },
    status:{
        type: String,
        default:'online'
    }
}, {minimize: false});


userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err,salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        })
    })
})
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
userSchema.statics.findByCredentials = async function(name, password){
    const user = await User.findOne({name});
    if (!user) throw new Error('invalid username');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid password');
    return user
}
const User = mongoose.model('User',userSchema);
module.exports = User